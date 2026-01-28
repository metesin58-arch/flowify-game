
import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView, TouchableOpacity, BackHandler } from 'react-native';
import { PlayerStats, TabType } from './src/types';
import { INITIAL_STATS, ECONOMY } from './src/constants';
import { observeAuth, savePlayerToCloud } from './src/services/authService';
import { db } from './src/services/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { preloadAllSounds, initAudioContext, playMusic, stopMusic } from './src/services/sfx';
import { UIProvider, useGameUI } from './src/context/UIContext';
import { Navigation } from './src/components/Navigation';
import { Dashboard } from './src/components/Dashboard';
import { AuthScreen } from './src/components/AuthScreen';
import { CharacterCreation } from './src/components/CharacterCreation';
import { Street } from './src/components/Street';
import { GameWebView } from './src/components/GameWebView';
import { ConcertMode } from './src/components/ConcertMode';
import { GameSelector } from './src/components/GameSelector';
import { SafeAreaWrapper } from './src/components/SafeAreaWrapper';
import type { User } from 'firebase/auth';

const GameContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [player, setPlayer] = useState<PlayerStats | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // View state
  const [activeTab, setActiveTab] = useState<TabType>('hub');
  const [viewMode, setViewMode] = useState<'selector' | 'hub' | 'career' | 'game' | 'creation'>('selector');
  const [activeGameType, setActiveGameType] = useState<string | null>(null);
  const [isEditingCharacter, setIsEditingCharacter] = useState(false);

  const { showToast } = useGameUI();

  useEffect(() => {
    const initGame = async () => {
      try {
        await initAudioContext();
        await preloadAllSounds((p) => console.log(`Loading SFX: ${p}%`));
        playMusic();
      } catch (e) {
        console.warn("Init Error", e);
      } finally {
        setIsLoading(false);
      }
    };
    initGame();

    const backAction = () => {
      if (viewMode === 'game') {
        setViewMode('hub');
        return true;
      }
      if (viewMode === 'career' || viewMode === 'hub') {
        setViewMode('selector');
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [viewMode]);

  useEffect(() => {
    const unsubAuth = observeAuth((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const statsRef = ref(db, `users/${currentUser.uid}/stats`);
        const unsubStats = onValue(statsRef, (snapshot) => {
          if (snapshot.exists()) {
            setPlayer({ ...INITIAL_STATS, ...snapshot.val() });
          } else {
            setPlayer(null); // Triggers character creation
            setViewMode('creation');
          }
          setAuthChecked(true);
        });
        return () => unsubStats();
      } else {
        setPlayer(null);
        setAuthChecked(true);
      }
    });
    return () => unsubAuth();
  }, []);

  // Energy Regeneration
  useEffect(() => {
    if (!player || !user) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const timeDiff = now - (player.lastEnergyUpdate || now);
      const energyToGain = Math.floor(timeDiff / ECONOMY.REGEN_TIME_MS);

      if (energyToGain > 0 && player.energy < player.maxEnergy) {
        const newEnergy = Math.min(player.maxEnergy, player.energy + energyToGain);
        const updatedStats = { ...player, energy: newEnergy, lastEnergyUpdate: now };
        savePlayerToCloud(user.uid, updatedStats);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [player, user]);

  const updateStat = (stat: keyof PlayerStats, amount: number) => {
    if (!player || !user) return;
    const current = (player[stat] as number) || 0;
    const newVal = current + amount;
    const updatedStats = { ...player, [stat]: newVal };
    setPlayer(updatedStats);
    savePlayerToCloud(user.uid, updatedStats);
  };

  const updateMultipleStats = (updates: Partial<PlayerStats>) => {
    if (!player || !user) return;
    const updatedStats = { ...player, ...updates };
    setPlayer(updatedStats);
    savePlayerToCloud(user.uid, updatedStats);
  };

  const handleGameLaunch = (gameId: string) => {
    setActiveGameType(gameId);
    setViewMode('game');
  };

  const handleGameEnd = (score: number) => {
    setViewMode('hub');
    setActiveGameType(null);
    showToast(`Oyun Bitti! Skor: ${score}`, 'success');
    // Rewards should be handled here or in GameWebView bridge
  };

  const handleOpenShop = (tab: any) => {
    showToast(`${tab} Marketi Yakında!`, 'info');
  };

  if (isLoading || !authChecked) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1ed760" />
        <Text style={styles.loadingText}>YÜKLENİYOR...</Text>
      </View>
    );
  }

  if (!user) return <AuthScreen />;

  if (viewMode === 'creation' || !player || isEditingCharacter) {
    return (
      <CharacterCreation
        isEditing={isEditingCharacter}
        initialData={player || undefined}
        onCreate={(name, gender, app, song) => {
          const newStats = player ? { ...player, name, gender, appearance: app, favoriteSong: song } : { ...INITIAL_STATS, name, gender, appearance: app, favoriteSong: song };
          setPlayer(newStats);
          savePlayerToCloud(user.uid, newStats);
          setIsEditingCharacter(false);
          setViewMode('selector');
        }}
      />
    );
  }

  if (viewMode === 'game' && activeGameType) {
    return <GameWebView gameType={activeGameType} onGameEnd={handleGameEnd} />;
  }

  if (viewMode === 'selector') {
    return <GameSelector player={player} onSelectMode={setViewMode} />;
  }

  if (viewMode === 'career') {
    return (
      <ConcertMode
        player={player}
        updateStat={updateStat}
        updateMultipleStats={updateMultipleStats}
        onExit={() => setViewMode('selector')}
        onEditCharacter={() => setIsEditingCharacter(true)}
        onOpenShop={handleOpenShop}
      />
    );
  }

  // HUB MODE (Main Tabs)
  return (
    <SafeAreaWrapper style={styles.container}>

      {/* Native Header for Cash & Energy */}
      <View style={styles.universalHeader}>
        <View>
          <Text style={styles.utilityLabel}>NAKİT</Text>
          <Text style={styles.cashText}>₺{player.careerCash.toLocaleString()}</Text>
        </View>
        <View style={styles.energyBox}>
          <Text style={styles.utilityLabel}>ENERJİ ⚡{Math.floor(player.energy)}</Text>
          <View style={styles.energyBarBg}>
            <View style={[styles.energyBarFill, { width: `${(player.energy / player.maxEnergy) * 100}%` }]} />
          </View>
        </View>
      </View>

      <View style={styles.mainContent}>
        {activeTab === 'hub' && (
          <Dashboard
            player={player}
            ownedUpgrades={player.ownedUpgrades || {}}
            onEditCharacter={() => setIsEditingCharacter(true)}
            updateStat={updateStat}
            updateMultipleStats={updateMultipleStats}
            onOpenShop={() => handleOpenShop('shop')}
          />
        )}
        {(activeTab === 'arcade' || activeTab === 'online') && (
          <Street player={player} mode={activeTab} onSelectGame={handleGameLaunch} />
        )}
        {activeTab === 'nightlife' && (
          <View style={styles.placeholderView}>
            <Text style={styles.placeholderIcon}>♠️</Text>
            <Text style={styles.placeholderText}>GECE HAYATI YAKINDA</Text>
          </View>
        )}
        {activeTab === 'social' && (
          <View style={styles.placeholderView}>
            <Text style={styles.placeholderIcon}>🌍</Text>
            <Text style={styles.placeholderText}>SOSYAL HUB YAKINDA</Text>
          </View>
        )}
      </View>

      <Navigation activeTab={activeTab} setTab={setActiveTab} />
    </SafeAreaWrapper>
  );
};

export default function App() {
  return (
    <UIProvider>
      <GameContent />
    </UIProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#1ed760', marginTop: 20, fontWeight: '900', letterSpacing: 2 },
  container: { flex: 1, backgroundColor: '#000' },
  universalHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100
  },
  utilityLabel: { color: '#737373', fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 2 },
  cashText: { color: '#1ed760', fontSize: 16, fontWeight: '900' },
  energyBox: { width: 120 },
  energyBarBg: { height: 6, backgroundColor: '#333', borderRadius: 3, overflow: 'hidden' },
  energyBarFill: { height: '100%', backgroundColor: '#fff' },
  mainContent: { flex: 1 },
  placeholderView: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#090909' },
  placeholderIcon: { fontSize: 60, marginBottom: 20 },
  placeholderText: { color: '#404040', fontSize: 18, fontWeight: '900', letterSpacing: 2 }
});
