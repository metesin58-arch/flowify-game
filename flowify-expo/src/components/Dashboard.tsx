
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, ActivityIndicator, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { PlayerStats, OnlineUser, ReleasedSong } from '../types';
import { Avatar } from './Avatar';
import { formatListeners, calculateLevelProgress, getNextLevelThreshold, calculateLevel } from '../services/gameLogic';
import { getGlobalLeaderboard } from '../services/matchmakingService';
import { DiscIcon, TrophyIcon, CoinIcon, MicIcon, DiamondIcon, CrownIcon, ArrowIcon } from './Icons';
import { useGameUI } from '../context/UIContext';
import { playClickSound } from '../services/sfx';

const { width, height } = Dimensions.get('window');

interface Props {
    player: PlayerStats;
    ownedUpgrades: Record<string, number>;
    onEditCharacter?: () => void;
    updateStat?: (stat: keyof PlayerStats, amount: number) => void;
    updateMultipleStats?: (updates: Partial<PlayerStats>) => void;
    onOpenShop: (tab: any) => void;
}

export const Dashboard: React.FC<Props> = ({ player, ownedUpgrades, onEditCharacter, updateStat, updateMultipleStats, onOpenShop }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [leaderboard, setLeaderboard] = useState<OnlineUser[]>([]);
    const [isLoadingLb, setIsLoadingLb] = useState(true);
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    const audioRef = useRef<Audio.Sound | null>(null);

    const isVerified = ownedUpgrades && ownedUpgrades['verified_badge'] && ownedUpgrades['verified_badge'] > 0;
    const xpPercent = calculateLevelProgress(player.monthly_listeners);
    const nextLevelThreshold = getNextLevelThreshold(player.monthly_listeners);

    useEffect(() => {
        let isMounted = true;
        const fetchLb = async () => {
            setIsLoadingLb(true);
            const list = await getGlobalLeaderboard(50);
            if (isMounted) {
                setLeaderboard(list);
                setIsLoadingLb(false);
            }
        };
        fetchLb();

        return () => {
            isMounted = false;
            if (audioRef.current) audioRef.current.unloadAsync();
        };
    }, []);

    const togglePlay = async () => {
        if (!player.favoriteSong?.previewUrl) return;

        try {
            if (isPlaying) {
                await audioRef.current?.pauseAsync();
                setIsPlaying(false);
            } else {
                if (!audioRef.current) {
                    const { sound } = await Audio.Sound.createAsync(
                        { uri: player.favoriteSong.previewUrl },
                        { shouldPlay: true, volume: 0.5 }
                    );
                    audioRef.current = sound;
                    audioRef.current.setOnPlaybackStatusUpdate((status: any) => {
                        if (status.isLoaded && status.didJustFinish) {
                            setIsPlaying(false);
                        }
                    });
                } else {
                    await audioRef.current.playAsync();
                }
                setIsPlaying(true);
            }
        } catch (e) {
            console.warn("Audio error", e);
        }
    };

    const king = leaderboard.length > 0 ? leaderboard[0] : null;

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} bounces={false}>

                {/* 1. HEADER SECTION (Profile Card) */}
                <View style={styles.header}>
                    <LinearGradient
                        colors={['#404040', '#121212']}
                        style={StyleSheet.absoluteFill}
                    />

                    {/* Character Visualization */}
                    <View style={styles.avatarContainer}>
                        <Avatar appearance={player.appearance} size={width * 0.8} style={{ opacity: 0.6 }} />
                        <LinearGradient
                            colors={['transparent', 'rgba(18, 18, 18, 0.6)', '#121212']}
                            style={StyleSheet.absoluteFill}
                        />
                    </View>

                    {/* Profile Stats */}
                    <View style={styles.profileContent}>
                        <View style={styles.badgeRow}>
                            {isVerified && (
                                <View style={styles.verifiedBadge}>
                                    <ArrowIcon size={10} color="#000" dir="up" />
                                </View>
                            )}
                            <Text style={[styles.artistLabel, { color: isVerified ? '#fff' : '#a3a3a3' }]}>
                                {isVerified ? 'DOĞRULANMIŞ SANATÇI' : 'SANATÇI'}
                            </Text>
                            <View style={styles.dot} />
                            <View style={styles.respectBadge}>
                                <TrophyIcon size={12} color="#facc15" />
                                <Text style={styles.respectText}>{player.respect.toLocaleString()}</Text>
                            </View>
                        </View>

                        <Text style={styles.artistName} numberOfLines={1}>{player.name}</Text>

                        {/* Level & Progress */}
                        <View style={styles.levelSection}>
                            <View style={styles.levelHeader}>
                                <Text style={styles.levelTitle}>SEVİYE {calculateLevel(player.monthly_listeners)}</Text>
                                <Text style={styles.nextLevelLabel}>SONRAKİ SEVİYE</Text>
                            </View>
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: `${xpPercent}%` }]} />
                            </View>
                            <View style={styles.progressFooter}>
                                <Text style={styles.progressText}>FAN (XP): {formatListeners(player.monthly_listeners)}</Text>
                                <Text style={styles.progressText}>HEDEF: {formatListeners(nextLevelThreshold)}</Text>
                            </View>
                        </View>

                        {/* Anthem Card */}
                        <View style={styles.actionRow}>
                            {player.favoriteSong ? (
                                <TouchableOpacity style={styles.anthemCard} onPress={togglePlay}>
                                    <Image
                                        source={{ uri: player.favoriteSong.artworkUrl100 }}
                                        style={[styles.anthemCover, isPlaying && styles.spinning]}
                                    />
                                    <View style={styles.anthemInfo}>
                                        <Text style={styles.anthemLabel}>MARŞ</Text>
                                        <Text style={styles.anthemTitle} numberOfLines={1}>{player.favoriteSong.trackName}</Text>
                                        <Text style={styles.anthemArtist} numberOfLines={1}>{player.favoriteSong.artistName}</Text>
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <Text style={styles.noAnthem}>Marş seçilmedi.</Text>
                            )}

                            <TouchableOpacity style={styles.editBtn} onPress={onEditCharacter}>
                                <Text style={styles.editBtnText}>DÜZENLE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Premium Button */}
                    <TouchableOpacity
                        style={styles.premiumBtn}
                        onPress={() => { playClickSound(); onOpenShop('vip'); }}
                    >
                        <DiamondIcon size={12} color="#fff" />
                        <Text style={styles.premiumBtnText}>PREMIUM</Text>
                        <View style={styles.saleBadge}>
                            <Text style={styles.saleText}>SALE</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* 2. DISCOGRAPHY SECTION */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <DiscIcon size={16} color="#fff" />
                        <Text style={styles.sectionTitle}>DİSKOGRAFİ</Text>
                    </View>

                    <View style={styles.listContainer}>
                        {player.discography && player.discography.length > 0 ? (
                            player.discography.map((song) => (
                                <SimpleSongItem key={song.id} song={song} />
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>Henüz şarkı yayınlamadın.</Text>
                                <Text style={styles.emptySubtext}>Kariyer bölümündeki stüdyoya git ve ilk hitini yap!</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* 3. SKILLS SECTION */}
                <View style={[styles.section, { marginBottom: 151 }]}>
                    <Text style={styles.sectionTitle}>YETENEKLER</Text>
                    <View style={styles.skillsGrid}>
                        <MinimalStat label="Flow" value={player.flow} color="#3b82f6" />
                        <MinimalStat label="Lirik" value={player.lyrics} color="#22c55e" />
                        <MinimalStat label="Ritim" value={player.rhythm} color="#eab308" />
                        <MinimalStat label="Karizma" value={player.charisma} color="#a855f7" />
                    </View>
                </View>
            </ScrollView>

            {/* LEADERBOARD BUTTON */}
            <TouchableOpacity
                style={styles.leaderboardBtn}
                onPress={() => setShowLeaderboard(true)}
            >
                <TrophyIcon size={28} color="#fff" />
            </TouchableOpacity>

            {/* LEADERBOARD MODAL */}
            <Modal visible={showLeaderboard} animationType="slide" transparent>
                <View style={styles.modalBg}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setShowLeaderboard(false)}>
                            <Text style={styles.closeBtnText}>✕</Text>
                        </TouchableOpacity>

                        <LinearGradient colors={['#451a03', '#121212']} style={styles.modalHeader}>
                            <Text style={styles.modalSubTitle}>FLOWIFY TOP 50</Text>
                            {isLoadingLb ? (
                                <ActivityIndicator color="#eab308" />
                            ) : king ? (
                                <View style={styles.kingContainer}>
                                    <CrownIcon size={64} color="#facc15" />
                                    <Text style={styles.kingName}>{king.name}</Text>
                                    <View style={styles.kingRespect}>
                                        <TrophyIcon size={16} color="#facc15" />
                                        <Text style={styles.kingRespectText}>{king.respect.toLocaleString()}</Text>
                                    </View>
                                </View>
                            ) : (
                                <Text style={styles.emptyText}>Sıralama bulunamadı.</Text>
                            )}
                        </LinearGradient>

                        <ScrollView style={styles.lbList}>
                            {leaderboard.slice(1).map((user: OnlineUser, idx: number) => (
                                <View key={user.uid} style={styles.lbItem}>
                                    <Text style={styles.rankText}>#{idx + 2}</Text>
                                    <View style={styles.lbAvatar}>
                                        <Text style={styles.lbLetter}>{user.name.charAt(0)}</Text>
                                    </View>
                                    <View style={styles.lbInfo}>
                                        <Text style={styles.lbName}>{user.name}</Text>
                                        <Text style={styles.lbLevel}>Lv {user.level}</Text>
                                    </View>
                                    <View style={styles.lbScore}>
                                        <Text style={styles.lbScoreValue}>{user.respect}</Text>
                                        <Text style={styles.lbScoreLabel}>Respect</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const MinimalStat = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <View style={styles.statCard}>
        <View style={styles.statHeader}>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={styles.statValue}>{value}</Text>
        </View>
        <View style={styles.statBarBg}>
            <View style={[styles.statBarFill, { width: `${Math.min(100, value)}%`, backgroundColor: color }]} />
        </View>
    </View>
);

const SimpleSongItem: React.FC<{ song: ReleasedSong }> = ({ song }) => {
    const hue = (song.name.length * 40) % 360;
    return (
        <View style={styles.songItem}>
            <LinearGradient
                colors={[`hsl(${hue}, 60%, 25%)`, `hsl(${hue}, 60%, 10%)`]}
                style={styles.songArt}
            >
                <Text style={styles.songInitial}>{song.name.charAt(0).toUpperCase()}</Text>
            </LinearGradient>
            <View style={styles.songMain}>
                <View style={styles.songTop}>
                    <Text style={styles.songTitle} numberOfLines={1}>{song.name}</Text>
                    <View style={styles.qualityBadge}>
                        <Text style={styles.qualityText}>%{song.quality}</Text>
                    </View>
                </View>
                <View style={styles.songDetails}>
                    <Text style={styles.songListenCount}>
                        {(song.popularityScore * 1000).toLocaleString()} <Text style={{ fontSize: 8, color: '#404040' }}>DİNLENME</Text>
                    </Text>
                    {song.totalEarnings > 0 && (
                        <Text style={styles.songEarnings}>+₺{song.totalEarnings.toLocaleString()}</Text>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212' },
    scrollView: { flex: 1 },
    header: {
        height: height * 0.45,
        minHeight: 350,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 25,
        position: 'relative'
    },
    avatarContainer: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    profileContent: { zIndex: 10 },
    badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    verifiedBadge: { backgroundColor: '#3b82f6', borderRadius: 10, padding: 2, marginRight: 8 },
    artistLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
    dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#404040', marginHorizontal: 8 },
    respectBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
    respectText: { color: '#fef3c7', fontSize: 10, fontWeight: '900', marginLeft: 4 },
    artistName: { color: '#fff', fontSize: 42, fontStyle: 'italic', fontWeight: '900', letterSpacing: -1, marginBottom: 12 },
    levelSection: { width: '70%', marginBottom: 20 },
    levelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 },
    levelTitle: { color: '#1ed760', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
    nextLevelLabel: { color: '#737373', fontSize: 8, fontWeight: '700' },
    progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
    progressBarFill: { height: '100%', backgroundColor: '#1ed760' },
    progressFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
    progressText: { color: '#a3a3a3', fontSize: 8, fontWeight: '700' },
    actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    anthemCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(24, 24, 24, 0.9)',
        borderRadius: 25,
        padding: 6,
        paddingRight: 15,
        maxWidth: 220,
        height: 48,
    },
    anthemCover: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
    spinning: { /* Animasyon gerekebilir */ },
    anthemInfo: { flex: 1 },
    anthemLabel: { color: '#1ed760', fontSize: 8, fontWeight: '900' },
    anthemTitle: { color: '#fff', fontSize: 10, fontWeight: '700' },
    anthemArtist: { color: '#a3a3a3', fontSize: 9 },
    editBtn: {
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        height: 48,
        justifyContent: 'center'
    },
    editBtnText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
    premiumBtn: {
        position: 'absolute',
        top: 100,
        right: 20,
        backgroundColor: '#ca8a04',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        zIndex: 100
    },
    premiumBtnText: { color: '#fff', fontSize: 9, fontWeight: '900', marginLeft: 6 },
    saleBadge: { backgroundColor: '#dc2626', paddingHorizontal: 4, borderRadius: 4, marginLeft: 6 },
    saleText: { color: '#fff', fontSize: 8, fontWeight: '900' },
    section: { paddingHorizontal: 20, marginTop: 25 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 8 },
    sectionTitle: { color: '#fff', fontSize: 14, fontWeight: '900', letterSpacing: 1 },
    listContainer: { backgroundColor: '#181818', borderRadius: 20, padding: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    emptyState: { paddingVertical: 30, alignItems: 'center' },
    emptyText: { color: '#737373', fontSize: 12, textAlign: 'center' },
    emptySubtext: { color: '#1ed760', fontSize: 10, fontWeight: '900', textAlign: 'center', marginTop: 10 },
    noAnthem: { color: '#737373', fontSize: 12, fontStyle: 'italic' },
    skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    statCard: { width: (width - 50) / 2, backgroundColor: '#111', padding: 12, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    statLabel: { color: '#a3a3a3', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
    statValue: { color: '#fff', fontSize: 13, fontWeight: '900' },
    statBarBg: { height: 4, backgroundColor: '#333', borderRadius: 2 },
    statBarFill: { height: '100%', borderRadius: 2 },
    songItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', padding: 12, borderRadius: 15, marginBottom: 10 },
    songArt: { width: 44, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    songInitial: { color: 'rgba(255,255,255,0.3)', fontSize: 20, fontWeight: '900' },
    songMain: { flex: 1, marginLeft: 12 },
    songTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    songTitle: { color: '#fff', fontSize: 13, fontWeight: '700' },
    qualityBadge: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 4, borderRadius: 4 },
    qualityText: { color: '#a3a3a3', fontSize: 8, fontWeight: '900' },
    songDetails: { flexDirection: 'row', gap: 10, marginTop: 4 },
    songListenCount: { color: '#a3a3a3', fontSize: 10, fontWeight: '700' },
    songEarnings: { color: '#1ed760', fontSize: 10, fontWeight: '900' },
    leaderboardBtn: {
        position: 'absolute',
        bottom: 120,
        right: 20,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#ca8a04',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#ca8a04',
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5
    },
    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#121212', height: '85%', borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
    closeBtn: { position: 'absolute', top: 20, right: 20, zIndex: 100, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
    closeBtnText: { color: '#fff', fontSize: 14 },
    modalHeader: { paddingVertical: 40, alignItems: 'center' },
    modalSubTitle: { color: '#facc15', fontSize: 10, fontWeight: '900', letterSpacing: 3, marginBottom: 20 },
    kingContainer: { alignItems: 'center' },
    kingName: { color: '#fef3c7', fontSize: 36, fontWeight: '900', fontStyle: 'italic' },
    kingRespect: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, backgroundColor: 'rgba(252,211,77,0.2)', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20 },
    kingRespectText: { color: '#fef3c7', fontSize: 18, fontWeight: '900' },
    lbList: { padding: 15 },
    lbItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', padding: 12, borderRadius: 15, marginBottom: 8 },
    rankText: { width: 30, color: '#737373', fontWeight: '900', fontSize: 12 },
    lbAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
    lbLetter: { color: '#fff', fontWeight: '900' },
    lbInfo: { flex: 1, marginLeft: 12 },
    lbName: { color: '#fff', fontWeight: '700', fontSize: 13 },
    lbLevel: { color: '#525252', fontSize: 10 },
    lbScore: { alignItems: 'flex-end' },
    lbScoreValue: { color: '#fff', fontWeight: '900', fontSize: 13 },
    lbScoreLabel: { color: '#404040', fontSize: 8, fontWeight: '900' }
});
