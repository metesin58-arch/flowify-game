
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ref, onValue } from 'firebase/database';
import { db } from '../services/firebaseConfig';
import { PlayerStats } from '../types';
import { MicIcon, UsersIcon, TrophyIcon, ArrowIcon } from './Icons';
import { playClickSound } from '../services/sfx';
import { logoutUser } from '../services/authService';
import { useGameUI } from '../context/UIContext';

const { height, width } = Dimensions.get('window');

interface Props {
    player: PlayerStats;
    onSelectMode: (mode: 'career' | 'selector' | 'hub') => void;
}

export const GameSelector: React.FC<Props> = ({ player, onSelectMode }) => {
    const [onlineCount, setOnlineCount] = useState(0);
    const { showToast } = useGameUI();

    useEffect(() => {
        const usersRef = ref(db, 'public_users');
        const unsubscribe = onValue(usersRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const now = Date.now();
                const activeCount = Object.values(data).filter((u: any) => now - u.lastActive < 120000).length;
                setOnlineCount(activeCount);
            } else {
                setOnlineCount(0);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSelect = (mode: any) => {
        playClickSound();
        onSelectMode(mode);
    };

    const handleLogout = () => {
        logoutUser();
        // Firebase Auth listener in App.tsx will handle the state change
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.avatarMini}><Text style={styles.avatarChar}>{player.name.charAt(0)}</Text></View>
                    <View>
                        <Text style={styles.headerName}>{player.name}</Text>
                        <Text style={styles.headerLevel}>Seviye {player.careerLevel || 1}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                    <ArrowIcon size={14} color="#ef4444" dir="right" />
                </TouchableOpacity>
            </View>

            {/* Top Half: CAREER */}
            <TouchableOpacity onPress={() => handleSelect('career')} activeOpacity={0.9} style={styles.panel}>
                <LinearGradient colors={['#1e1b4b', '#312e81', '#0f172a']} style={StyleSheet.absoluteFill} />
                <View style={styles.content}>
                    <View style={[styles.circle, { backgroundColor: 'rgba(168,85,247,0.1)', borderColor: 'rgba(168,85,247,0.3)' }]}>
                        <MicIcon size={40} color="#c084fc" />
                    </View>
                    <Text style={styles.panelTitle}>KARİYER</Text>
                    <Text style={styles.panelSubtitle}>DÜNYA TURNESİ & ALBÜM</Text>
                    <View style={styles.badge}><Text style={styles.badgeText}>{player.week}. HAFTA</Text></View>
                </View>
            </TouchableOpacity>

            {/* Bottom Half: HUB */}
            <TouchableOpacity onPress={() => handleSelect('hub')} activeOpacity={0.9} style={styles.panel}>
                <LinearGradient colors={['#064e3b', '#022c22', '#0a0a0a']} style={StyleSheet.absoluteFill} />
                <View style={styles.content}>
                    <View style={[styles.circle, { backgroundColor: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.3)' }]}>
                        <UsersIcon size={40} color="#1ed760" />
                        <View style={styles.onlineBadge}>
                            <View style={styles.onlineDot} />
                            <Text style={styles.onlineText}>{onlineCount}</Text>
                        </View>
                    </View>
                    <Text style={styles.panelTitle}>ONLINE HUB</Text>
                    <Text style={styles.panelSubtitle}>SAVAŞLAR & SOSYAL ARENA</Text>
                    <View style={styles.respectBadge}>
                        <TrophyIcon size={12} color="#1ed760" />
                        <Text style={styles.respectText}>{player.respect} RESPECT</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Middle Divider */}
            <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <View style={styles.dividerBox}><Text style={styles.dividerText}>MOD SEÇİMİ</Text></View>
                <View style={styles.dividerLine} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { position: 'absolute', top: 60, left: 25, right: 25, zIndex: 100, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    avatarMini: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginRight: 10 },
    avatarChar: { color: '#fff', fontWeight: '900' },
    headerName: { color: '#fff', fontSize: 14, fontWeight: '900' },
    headerLevel: { color: '#737373', fontSize: 11, fontWeight: '700' },
    logoutBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    panel: { flex: 1, overflow: 'hidden' },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
    circle: { width: 100, height: 100, borderRadius: 50, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    panelTitle: { color: '#fff', fontSize: 40, fontWeight: '900', fontStyle: 'italic', letterSpacing: -1 },
    panelSubtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '900', letterSpacing: 3, marginBottom: 15 },
    badge: { backgroundColor: 'rgba(126, 34, 206, 0.3)', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(126, 34, 206, 0.4)' },
    badgeText: { color: '#e9d5ff', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
    onlineBadge: { position: 'absolute', bottom: -5, backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)' },
    onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981', marginRight: 4 },
    onlineText: { color: '#fff', fontSize: 9, fontWeight: '900' },
    respectBadge: { backgroundColor: 'rgba(20, 83, 45, 0.4)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)' },
    respectText: { color: '#fff', fontSize: 10, fontWeight: '900' },
    divider: { position: 'absolute', top: height / 2, width: '100%', height: 40, marginTop: -20, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 40 },
    dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
    dividerBox: { backgroundColor: '#000', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 50, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginHorizontal: 10 },
    dividerText: { color: '#737373', fontSize: 8, fontWeight: '900', letterSpacing: 2 }
});
