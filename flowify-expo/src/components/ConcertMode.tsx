
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { PlayerStats, SongTrack, CityKey } from '../types';
import { CareerHub } from './CareerHub';
import { TourMap } from './TourMap';
import { VenueSelection } from './VenueSelection';
import { ConcertSetup } from './ConcertSetup';
import { PRE_CONCERT_SCENARIOS, POST_CONCERT_SCENARIOS, ScenarioModal, ScenarioResultModal } from './ScenarioSystem';
import { calculateConcertRevenue, handleWeeklyExpenses } from '../services/gameLogic';
import { playMusic, stopMusic, playClickSound } from '../services/sfx';

interface Props {
    player: PlayerStats;
    updateStat: (stat: keyof PlayerStats, amount: number) => void;
    updateMultipleStats: (updates: Partial<PlayerStats>) => void;
    onExit: () => void;
    onEditCharacter?: () => void;
    onOpenShop: (tab: any) => void;
}

type ConcertPhase = 'hub' | 'city_select' | 'venue_select' | 'pre_scenario' | 'setup' | 'simulation' | 'post_scenario' | 'result';

export const ConcertMode: React.FC<Props> = ({ player, updateStat, updateMultipleStats, onExit, onEditCharacter, onOpenShop }) => {
    const [phase, setPhase] = useState<ConcertPhase>('hub');
    const [selectedVenue, setSelectedVenue] = useState<any>(null);
    const [ticketPrice, setTicketPrice] = useState(50);
    const [setlist, setSetlist] = useState<SongTrack[]>([]);

    // Scenarios
    const [activeScenario, setActiveScenario] = useState<any>(null);
    const [scenarioOutcome, setScenarioOutcome] = useState<string | null>(null);

    // Results
    const [gainedStats, setGainedStats] = useState({ cash: 0, fans: 0, sukces: true });

    const handleCitySelect = (cityId: CityKey) => {
        updateMultipleStats({ currentCity: cityId });
        setPhase('venue_select');
    };

    const handleVenueConfirm = (venue: any, price: number) => {
        setSelectedVenue(venue);
        setTicketPrice(price);
        updateStat('careerCash', -venue.rentCost);
        const randScenario = PRE_CONCERT_SCENARIOS[Math.floor(Math.random() * PRE_CONCERT_SCENARIOS.length)];
        setActiveScenario(randScenario);
        setPhase('pre_scenario');
    };

    const handleScenarioOption = (effects: any, outcome: string) => {
        if (effects) {
            updateMultipleStats(effects);
        }
        setActiveScenario(null);
        setScenarioOutcome(outcome);
    };

    const closeScenarioOutcome = () => {
        setScenarioOutcome(null);
        if (phase === 'pre_scenario') setPhase('setup');
        else if (phase === 'post_scenario') setPhase('result');
    };

    const startConcert = (songs: SongTrack[]) => {
        setSetlist(songs);
        setPhase('simulation');
        // Auto-complete simulation for now in Native
        setTimeout(() => finishConcert(80), 2000);
    };

    const finishConcert = (score: number) => {
        const baseRevenue = (selectedVenue.capacity * 0.8 * ticketPrice) + (score * 10);
        const cashChange = calculateConcertRevenue(baseRevenue, player.currentCity || 'eskisehir', player);
        const fanChange = Math.floor(selectedVenue.capacity * 0.1);

        const finalUpdates: any = {
            careerCash: player.careerCash + cashChange,
            monthly_listeners: player.monthly_listeners + fanChange,
            week: player.week + 1
        };

        setGainedStats({ cash: cashChange, fans: fanChange, sukces: true });
        updateMultipleStats(finalUpdates);

        const randScenario = POST_CONCERT_SCENARIOS[Math.floor(Math.random() * POST_CONCERT_SCENARIOS.length)];
        setActiveScenario(randScenario);
        setPhase('post_scenario');
    };

    if (phase === 'hub') return <CareerHub player={player} onStartSetup={() => setPhase('city_select')} onExit={onExit} updateStat={updateStat} updateMultipleStats={updateMultipleStats} onEditCharacter={onEditCharacter} onOpenShop={onOpenShop} />;
    if (phase === 'city_select') return <TourMap player={player} onSelectCity={handleCitySelect} onClose={() => setPhase('hub')} />;
    if (phase === 'venue_select') return <VenueSelection player={player} onConfirm={handleVenueConfirm} onBack={() => setPhase('city_select')} />;
    if (phase === 'setup') return <ConcertSetup player={player} onComplete={startConcert} onBack={() => setPhase('venue_select')} />;

    if (activeScenario) return <ScenarioModal scenario={activeScenario} onOptionSelect={(opt) => handleScenarioOption(opt.effects, opt.outcome)} />;
    if (scenarioOutcome) return <ScenarioResultModal outcome={scenarioOutcome} onClose={closeScenarioOutcome} />;

    if (phase === 'simulation') {
        return (
            <View style={styles.simContainer}>
                <Text style={styles.simTitle}>KONSER BAŞLADI!</Text>
                <Text style={styles.simSub}>SEYİRCİ COŞUYOR...</Text>
                <ActivityIndicator size="large" color="#1ed760" style={{ marginTop: 40 }} />
            </View>
        );
    }

    if (phase === 'result') {
        return (
            <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>KONSER BİTTİ!</Text>
                <View style={styles.resultCard}>
                    <Text style={styles.resultStat}>KAZANÇ: ₺{gainedStats.cash.toLocaleString()}</Text>
                    <Text style={[styles.resultStat, { color: '#a855f7' }]}>YENİ DİNLEYİCİ: +{gainedStats.fans.toLocaleString()}</Text>
                </View>
                <TouchableOpacity onPress={() => setPhase('hub')} style={styles.resultBtn}>
                    <Text style={styles.resultBtnText}>KULİSE DÖN</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return null;
};

import { ActivityIndicator } from 'react-native';

const styles = StyleSheet.create({
    simContainer: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
    simTitle: { color: '#fff', fontSize: 32, fontWeight: '900', fontStyle: 'italic' },
    simSub: { color: '#1ed760', fontSize: 14, fontWeight: '900', letterSpacing: 2, marginTop: 10 },
    resultContainer: { flex: 1, backgroundColor: '#050505', alignItems: 'center', justifyContent: 'center', padding: 40 },
    resultTitle: { color: '#fff', fontSize: 32, fontWeight: '900', fontStyle: 'italic', marginBottom: 40 },
    resultCard: { width: '100%', backgroundColor: '#111', padding: 30, borderRadius: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 40 },
    resultStat: { color: '#1ed760', fontSize: 20, fontWeight: '900', marginBottom: 15 },
    resultBtn: { backgroundColor: '#fff', paddingHorizontal: 40, paddingVertical: 20, borderRadius: 30 },
    resultBtnText: { color: '#000', fontWeight: '900', letterSpacing: 1 }
});
