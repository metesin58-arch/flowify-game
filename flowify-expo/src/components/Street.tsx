
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PlayerStats } from '../types';
import {
    MicIcon,
    DiscIcon,
    ArrowUpDownIcon,
    TrophyIcon,
    PlayIcon,
    SpectrumIcon,
    BreakdanceIcon,
    QuestionMarkIcon,
    CrownIcon,
    HexagonIcon,
    GlobeIcon
} from './Icons';
import { playErrorSound, playClickSound } from '../services/sfx';
import { calculateLevel } from '../services/gameLogic';

const { width } = Dimensions.get('window');

interface Props {
    player: PlayerStats;
    onSelectGame: (game: string) => void;
    mode: 'online' | 'arcade';
}

interface GameCardProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    bgIcon: React.ReactNode;
    accentColor: string;
    badge?: string;
    badgeIcon?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ title, subtitle, icon, bgIcon, accentColor, badge, badgeIcon, onClick, disabled }) => (
    <TouchableOpacity
        onPress={disabled ? undefined : onClick}
        disabled={disabled}
        activeOpacity={0.8}
        style={[styles.card, disabled && { opacity: 0.5 }]}
    >
        <LinearGradient
            colors={['#050505', '#050505', `${accentColor}44`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
        />

        <View style={styles.bgIconContainer}>
            {React.cloneElement(bgIcon as React.ReactElement, { size: 120, color: accentColor, style: { opacity: 0.07, transform: [{ rotate: '15deg' }, { scale: 2 }] } })}
        </View>

        <View style={styles.cardContent}>
            <View style={styles.cardLeft}>
                <LinearGradient
                    colors={['#222', '#0a0a0a']}
                    style={styles.iconBox}
                >
                    {React.cloneElement(icon as React.ReactElement, { size: 28, color: accentColor })}
                </LinearGradient>

                <View style={styles.textContainer}>
                    {badge && (
                        <View style={[styles.badge, { backgroundColor: `${accentColor}22`, borderColor: `${accentColor}55` }]}>
                            <Text style={[styles.badgeText, { color: accentColor }]}>{badge}</Text>
                            {badgeIcon && React.cloneElement(badgeIcon as React.ReactElement, { size: 10, color: accentColor })}
                        </View>
                    )}
                    <Text style={styles.cardTitle}>{title}</Text>
                    <Text style={styles.cardSubtitle}>{subtitle}</Text>
                </View>
            </View>

            <View style={styles.playBtn}>
                <PlayIcon size={12} color="#fff" />
            </View>
        </View>

        {/* Bottom Accent Line */}
        <LinearGradient
            colors={['transparent', accentColor, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bottomLine}
        />
    </TouchableOpacity>
);

export const Street: React.FC<Props> = ({ player, onSelectGame, mode }) => {
    const currentLevel = calculateLevel(player.monthly_listeners);
    const isOnlineLocked = mode === 'online' && currentLevel < 2;

    const handleLockedClick = () => {
        playErrorSound();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <View style={[styles.statusDot, { backgroundColor: mode === 'online' ? '#3b82f6' : '#a855f7' }]} />
                    <Text style={styles.statusLabel}>{mode === 'online' ? 'GLOBAL ARENA' : 'ARCADE CENTER'}</Text>
                </View>
                <Text style={styles.title}>
                    {mode === 'online' ? 'ONLINE ARENA' : 'ARCADE'}
                    {mode === 'arcade' && <Text style={styles.soloLabel}> (SOLO)</Text>}
                </Text>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                {mode === 'arcade' && (
                    <>
                        <GameCard title="FLOW TRAP" subtitle="Refleks Testi" accentColor="#a855f7" badge="YENİ" icon={<HexagonIcon />} bgIcon={<HexagonIcon />} onClick={() => onSelectGame('hexagon')} />
                        <GameCard title="AŞAĞI / YUKARI" subtitle="Eski mi Yeni mi?" accentColor="#0077ff" badge="BİLGİ" icon={<ArrowUpDownIcon />} bgIcon={<ArrowUpDownIcon />} onClick={() => onSelectGame('higherlower-solo')} />
                        <GameCard title="RİTİM OYUNU" subtitle="Kelimeleri yakala" accentColor="#00f2ff" badge="VİRAL OYUN" icon={<SpectrumIcon />} bgIcon={<SpectrumIcon />} onClick={() => onSelectGame('rhythmtwister')} />
                        <GameCard title="BREAKDANCE" subtitle="Flow'unu göster" accentColor="#ff6b00" icon={<BreakdanceIcon />} bgIcon={<BreakdanceIcon />} onClick={() => onSelectGame('flowbattle-solo')} />
                        <GameCard title="RAP QUIZ" subtitle="Kültür testi" accentColor="#00ff66" badge="SIRALAMA" icon={<QuestionMarkIcon />} bgIcon={<QuestionMarkIcon />} onClick={() => onSelectGame('rapquiz')} />
                        <GameCard title="REFLEX" subtitle="Zamanlama testi" accentColor="#ff008c" icon={<DiscIcon />} bgIcon={<DiscIcon />} onClick={() => onSelectGame('rhythm')} />
                        <GameCard title="FREESTYLE" subtitle="Çevrimdışı Kapışma" accentColor="#a855f7" badge="1V1" icon={<MicIcon />} bgIcon={<MicIcon />} onClick={() => onSelectGame('freestyle')} />
                        <GameCard title="FLAPPY DISC" subtitle="Engelleri aş" accentColor="#1ed760" icon={<DiscIcon />} bgIcon={<DiscIcon />} onClick={() => onSelectGame('flappydisk')} />
                    </>
                )}

                {mode === 'online' && !isOnlineLocked && (
                    <>
                        <GameCard title="BREAKDANCE BATTLE" subtitle="Gerçek oyuncular" accentColor="#ff4d00" badge="PVP" icon={<BreakdanceIcon />} bgIcon={<BreakdanceIcon />} onClick={() => onSelectGame('flowbattle')} />
                        <GameCard title="AŞAĞI / YUKARI" subtitle="Tarihleri tahmin et" accentColor="#0077ff" badge="PVP" icon={<ArrowUpDownIcon />} bgIcon={<ArrowUpDownIcon />} onClick={() => onSelectGame('higherlower')} />
                        <GameCard title="RAPQUIZ BATTLE" subtitle="Bilgi yarışı" accentColor="#bf00ff" badge="PVP" icon={<TrophyIcon />} bgIcon={<TrophyIcon />} onClick={() => onSelectGame('trivia')} />
                    </>
                )}

                {isOnlineLocked && (
                    <TouchableOpacity activeOpacity={1} onPress={handleLockedClick} style={styles.lockContainer}>
                        <View style={styles.lockBox}>
                            <Text style={styles.lockEmoji}>🔒</Text>
                            <Text style={styles.lockTitle}>ERİŞİM YASAK</Text>
                            <Text style={styles.lockSubtitle}>ONLINE ARENA İÇİN</Text>
                            <View style={styles.lockBadge}><Text style={styles.lockBadgeText}>SEVİYE 2 GEREKLİ</Text></View>
                            <Text style={styles.lockHint}>FAN KAZANARAK SEVİYE ATLA</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { paddingHorizontal: 25, paddingTop: 80, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 8 },
    statusLabel: { color: '#737373', fontSize: 10, fontWeight: '900', letterSpacing: 4 },
    title: { color: '#fff', fontSize: 32, fontWeight: '900', fontStyle: 'italic', letterSpacing: -1 },
    soloLabel: { fontSize: 16, color: '#a855f7' },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 },
    card: { height: 90, borderRadius: 20, marginBottom: 15, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    cardContent: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, zIndex: 10 },
    cardLeft: { flexDirection: 'row', alignItems: 'center' },
    iconBox: { width: 56, height: 56, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    textContainer: { marginLeft: 15 },
    badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, borderWidth: 1, marginBottom: 4, alignSelf: 'flex-start' },
    badgeText: { fontSize: 8, fontWeight: '900', letterSpacing: 1, marginRight: 4 },
    cardTitle: { color: '#fff', fontSize: 18, fontWeight: '900', fontStyle: 'italic', letterSpacing: -0.5 },
    cardSubtitle: { color: '#737373', fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
    playBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
    bgIconContainer: { ...StyleSheet.absoluteFillObject, alignItems: 'flex-end', justifyContent: 'center', right: -20 },
    bottomLine: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 1.5 },
    lockContainer: { height: 400, alignItems: 'center', justifyContent: 'center' },
    lockBox: { backgroundColor: 'rgba(20,20,20,0.9)', padding: 40, borderRadius: 40, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    lockEmoji: { fontSize: 48, marginBottom: 20 },
    lockTitle: { color: '#fff', fontSize: 24, fontWeight: '900', fontStyle: 'italic' },
    lockSubtitle: { color: '#737373', fontSize: 10, fontWeight: '900', marginBottom: 15 },
    lockBadge: { backgroundColor: '#3b82f6', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
    lockBadgeText: { color: '#fff', fontWeight: '900', letterSpacing: 1 },
    lockHint: { color: '#525252', fontSize: 9, fontWeight: '900', marginTop: 20 }
});
