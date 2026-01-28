
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PlayerStats, CityKey } from '../types';
import { Avatar } from './Avatar';
import {
    MicIcon,
    PlayIcon,
    CoinIcon,
    DiamondIcon,
    ArrowIcon,
    TrophyIcon,
    UsersIcon,
    ClockIcon,
    CheckIcon,
    PlusIcon
} from './Icons';
import { CITIES, ECONOMY } from '../constants';
import { playClickSound } from '../services/sfx';

const { width } = Dimensions.get('window');

interface Props {
    player: PlayerStats;
    onStartSetup: () => void;
    onExit: () => void;
    updateStat: (stat: keyof PlayerStats, amount: number) => void;
    updateMultipleStats: (updates: Partial<PlayerStats>) => void;
    onEditCharacter?: () => void;
    onOpenShop: (tab: any) => void;
}

export const CareerHub: React.FC<Props> = ({ player, onStartSetup, onExit, updateStat, updateMultipleStats, onEditCharacter, onOpenShop }) => {
    const [isStatsOpen, setIsStatsOpen] = useState(false);
    const [showActivities, setShowActivities] = useState(false);

    const isVerified = player.ownedUpgrades?.['verified_badge'] > 0;
    const currentCityConfig = CITIES[player.currentCity || 'eskisehir'];

    const handleTrain = (skill: keyof PlayerStats) => {
        playClickSound();
        if (player.energy < ECONOMY.COST.TRAINING) { onOpenShop('energy'); return; }
        if (player.careerCash < ECONOMY.TRAINING_PRICE) { onOpenShop('currency'); return; }

        updateMultipleStats({
            energy: -ECONOMY.COST.TRAINING,
            careerCash: -ECONOMY.TRAINING_PRICE,
            [skill]: (player[skill] as number) + 1
        });
    };

    const handleFixRel = (rel: keyof PlayerStats) => {
        playClickSound();
        if (player.energy < ECONOMY.COST.RELATIONSHIP) { onOpenShop('energy'); return; }
        if (player.careerCash < ECONOMY.TRAINING_PRICE) { onOpenShop('currency'); return; }
        if ((player[rel] as number) >= 100) return;

        updateMultipleStats({
            energy: -ECONOMY.COST.RELATIONSHIP,
            careerCash: -ECONOMY.TRAINING_PRICE,
            [rel]: (player[rel] as number) + 5
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

                {/* 1. HEADER HERO */}
                <View style={styles.hero}>
                    <LinearGradient colors={['#111', '#000']} style={StyleSheet.absoluteFill} />
                    <View style={styles.avatarWrap}>
                        <Avatar appearance={player.appearance} size={width} style={{ opacity: 0.5 }} />
                        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)', '#000']} style={StyleSheet.absoluteFill} />
                    </View>

                    <View style={styles.heroContent}>
                        <View style={styles.topRow}>
                            <TouchableOpacity style={styles.backBtn} onPress={onExit}>
                                <ArrowIcon size={16} color="#fff" dir="left" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.premiumBadge} onPress={() => onOpenShop('vip')}>
                                <DiamondIcon size={10} color="#fff" />
                                <Text style={styles.premiumText}>PREMIUM</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.artistInfo}>
                            <View style={styles.verifiedRow}>
                                {isVerified && <View style={styles.vBadge}><CheckIcon size={8} color="#000" /></View>}
                                <Text style={[styles.vLabel, { color: isVerified ? '#fff' : '#737373' }]}>
                                    {isVerified ? 'DOĞRULANMIŞ SANATÇI' : 'SANATÇI'}
                                </Text>
                            </View>
                            <Text style={styles.nameText}>{player.name}</Text>

                            <View style={styles.metaRow}>
                                <View style={styles.weekBadge}><Text style={styles.weekText}>HAFTA {player.week}</Text></View>
                                <Text style={styles.cashText}>₺{player.careerCash.toLocaleString()}</Text>
                                <View style={styles.cityBadge}><Text style={styles.cityText}>{currentCityConfig.name}</Text></View>
                            </View>

                            {/* Energy Bar */}
                            <View style={styles.energySection}>
                                <View style={styles.energyHeader}>
                                    <Text style={styles.energyLabel}>ENERJİ</Text>
                                    <Text style={[styles.energyValue, player.energy < 20 && { color: '#ef4444' }]}>
                                        {Math.floor(player.energy)} / {player.maxEnergy}
                                    </Text>
                                </View>
                                <View style={styles.energyGrid}>
                                    {[...Array(10)].map((_, i) => (
                                        <View key={i} style={[styles.energyDot, i < Math.floor(player.energy / 10) && { backgroundColor: player.energy < 20 ? '#ef4444' : '#1ed760' }]} />
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* 2. MAIN ACTION */}
                <View style={styles.actionSection}>
                    <TouchableOpacity style={styles.concertBtn} onPress={onStartSetup}>
                        <MicIcon size={20} color="#000" />
                        <Text style={styles.concertBtnText}>KONSER VER (-25⚡)</Text>
                    </TouchableOpacity>
                </View>

                {/* 3. STATS TOGGLE */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={[styles.toggleBtn, isStatsOpen && styles.toggleBtnActive]}
                        onPress={() => { playClickSound(); setIsStatsOpen(!isStatsOpen); }}
                    >
                        <Text style={styles.toggleText}>İSTATİSTİKLER</Text>
                        <ArrowIcon size={14} color="#737373" dir={isStatsOpen ? 'up' : 'down'} />
                    </TouchableOpacity>

                    {isStatsOpen && (
                        <View style={styles.statsGrid}>
                            <View style={styles.statsBox}>
                                <Text style={styles.statsSubtitle}>YETENEKLER</Text>
                                <View style={styles.skillGridInner}>
                                    <SmallSkill label="Flow" val={player.flow} color="#3b82f6" />
                                    <SmallSkill label="Lirik" val={player.lyrics} color="#22c55e" />
                                    <SmallSkill label="Ritim" val={player.rhythm} color="#eab308" />
                                    <SmallSkill label="Swag" val={player.charisma} color="#a855f7" />
                                </View>
                            </View>
                            <View style={styles.statsBox}>
                                <Text style={styles.statsSubtitle}>İLİŞKİLER</Text>
                                <View style={styles.relStack}>
                                    <RelBar label="Menajer" val={player.rel_manager} />
                                    <RelBar label="Ekip" val={player.rel_team} />
                                    <RelBar label="Fanlar" val={player.rel_fans} />
                                    <RelBar label="Aşk" val={player.rel_partner} />
                                </View>
                            </View>
                        </View>
                    )}
                </View>

                {/* 4. MANAGEMENT GRID */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>KARİYER YÖNETİMİ</Text>
                    <View style={styles.grid2x2}>
                        <CareerBtn label="SAHİSİNDEN" sub="Araba Al-Sat" color="#d97706" emoji="🚗" onPress={() => { }} />
                        <CareerBtn label="STÜDYO" sub="Hit Şarkı Yap" color="#dc2626" emoji="🎙️" onPress={() => { }} />
                        <CareerBtn label="MENAJERLİK" sub="İş Bağla" color="#2563eb" emoji="🤝" onPress={() => { }} />
                        <CareerBtn label="TURNE" sub="Şehir Gez" color="#9333ea" emoji="🗺️" onPress={() => { }} />
                    </View>
                </View>

                {/* 5. LIFESTYLE GRID */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>YAŞAM TARZI</Text>
                    <View style={styles.grid2x2}>
                        <LifestyleBtn label="STİL" sub="İmaj Yenile" icon="👕" color="#a21caf" onPress={() => { }} />
                        <LifestyleBtn label="GECE HAYATI" sub="Paranı Katla" icon="♠️" color="#166534" onPress={() => { }} />
                    </View>
                    <TouchableOpacity style={styles.trainBtn} onPress={() => setShowActivities(true)}>
                        <Text style={styles.trainBtnText}>⚡ ANTRENMAN VE GELİŞİM</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* ACTIVITIES MODAL */}
            <Modal visible={showActivities} animationType="slide" transparent>
                <View style={styles.modalBg}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>ANTRENMAN & GELİŞİM</Text>
                            <TouchableOpacity onPress={() => setShowActivities(false)} style={styles.modalClose}>
                                <Text style={styles.modalCloseText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalScroll}>
                            <Text style={styles.modalSection}>KİŞİSEL GELİŞİM</Text>
                            <ActivityItem title="Stüdyo Antrenmanı" sub="+1 Flow" energy={20} cost={2500} icon="🎙️" onPress={() => handleTrain('flow')} />
                            <ActivityItem title="Kitap Oku" sub="+1 Lirik" energy={20} cost={2500} icon="📚" onPress={() => handleTrain('lyrics')} />
                            <ActivityItem title="Stil Danışmanı" sub="+1 Karizma" energy={20} cost={2500} icon="✨" onPress={() => handleTrain('charisma')} />

                            <Text style={[styles.modalSection, { marginTop: 20 }]}>SOSYAL İLİŞKİLER</Text>
                            <ActivityItem title="Menajer Toplantısı" sub="+5 Menajer" energy={20} cost={2500} icon="🤝" onPress={() => handleFixRel('rel_manager')} />
                            <ActivityItem title="Ekip Yemeği" sub="+5 Ekip" energy={20} cost={2500} icon="🍕" onPress={() => handleFixRel('rel_team')} />
                            <ActivityItem title="Fan Buluşması" sub="+5 Fanlar" energy={20} cost={2500} icon="❤️" onPress={() => handleFixRel('rel_fans')} />
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const SmallSkill = ({ label, val, color }: any) => (
    <View style={styles.skillBox}>
        <Text style={[styles.skillVal, { color }]}>{val}</Text>
        <Text style={styles.skillLabel}>{label}</Text>
    </View>
);

const RelBar = ({ label, val }: any) => (
    <View style={styles.relRow}>
        <View style={styles.relLabelRow}>
            <Text style={styles.relLabel}>{label}</Text>
            <Text style={[styles.relVal, val < 30 && { color: '#ef4444' }]}>{val}%</Text>
        </View>
        <View style={styles.relBarBg}>
            <View style={[styles.relBarFill, { width: `${val}%`, backgroundColor: val < 30 ? '#ef4444' : val < 70 ? '#eab308' : '#22c55e' }]} />
        </View>
    </View>
);

const CareerBtn = ({ label, sub, color, emoji, onPress }: any) => (
    <TouchableOpacity style={[styles.gridBtn, { backgroundColor: color }]} onPress={onPress}>
        <View style={styles.gridBtnEmoji}><Text style={styles.emojiText}>{emoji}</Text></View>
        <View style={styles.gridBtnTexts}>
            <Text style={styles.gridBtnLabel}>{label}</Text>
            <Text style={styles.gridBtnSub}>{sub}</Text>
        </View>
    </TouchableOpacity>
);

const LifestyleBtn = ({ label, sub, icon, color, onPress }: any) => (
    <TouchableOpacity style={[styles.lifestyleBtn, { backgroundColor: color }]} onPress={onPress}>
        <Text style={styles.lifestyleIcon}>{icon}</Text>
        <Text style={styles.gridBtnLabel}>{label}</Text>
        <Text style={styles.gridBtnSub}>{sub}</Text>
    </TouchableOpacity>
);

const ActivityItem = ({ title, sub, energy, cost, icon, onPress }: any) => (
    <TouchableOpacity style={styles.activityItem} onPress={onPress}>
        <View style={styles.activityIconBox}><Text style={{ fontSize: 20 }}>{icon}</Text></View>
        <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.activityTitle}>{title}</Text>
            <Text style={styles.activitySub}>{sub}</Text>
        </View>
        <View style={styles.activityCosts}>
            <Text style={styles.activityEnergy}>-{energy}⚡</Text>
            <Text style={styles.activityCash}>-₺{cost}</Text>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#090909' },
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 50 },
    hero: { height: height * 0.45, minHeight: 400, justifyContent: 'flex-end' },
    avatarWrap: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
    heroContent: { padding: 25, zIndex: 10 },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', top: 60, left: 25, right: 25 },
    backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    premiumBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ca8a04', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    premiumText: { color: '#fff', fontSize: 10, fontWeight: '900', marginLeft: 6 },
    artistInfo: { marginTop: 20 },
    verifiedRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    vBadge: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center', marginRight: 6 },
    vLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
    nameText: { color: '#fff', fontSize: 44, fontWeight: '900', fontStyle: 'italic', letterSpacing: -2, marginBottom: 10 },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
    weekBadge: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    weekText: { color: '#fff', fontSize: 10, fontWeight: '900' },
    cashText: { color: '#1ed760', fontWeight: '900', fontSize: 14 },
    cityBadge: { backgroundColor: 'rgba(37, 99, 235, 0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(37,99,235,0.3)' },
    cityText: { color: '#60a5fa', fontSize: 10, fontWeight: '900' },
    energySection: { width: 160 },
    energyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    energyLabel: { color: '#737373', fontSize: 9, fontWeight: '900' },
    energyValue: { color: '#fff', fontSize: 10, fontWeight: '900' },
    energyGrid: { flexDirection: 'row', gap: 4 },
    energyDot: { flex: 1, height: 4, backgroundColor: '#222', borderRadius: 2 },
    actionSection: { paddingHorizontal: 25, marginTop: 20 },
    concertBtn: { backgroundColor: '#1ed760', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 30, shadowColor: '#1ed760', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
    concertBtnText: { color: '#000', fontWeight: '900', fontSize: 14, marginLeft: 10, letterSpacing: 1 },
    section: { paddingHorizontal: 25, marginTop: 30 },
    toggleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1a1a1a', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    toggleBtnActive: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' },
    toggleText: { color: '#fff', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
    statsGrid: { flexDirection: 'row', gap: 10, marginTop: 10 },
    statsBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    statsSubtitle: { color: '#525252', fontSize: 8, fontWeight: '900', textAlign: 'center', marginBottom: 10, letterSpacing: 1 },
    skillGridInner: { gridTemplateColumns: 'repeat(2, 1fr)', gap: 5 }, // Native doesn't support grid like this, using flex
    skillBox: { backgroundColor: '#000', padding: 8, borderRadius: 10, alignItems: 'center', marginBottom: 5 },
    skillVal: { fontSize: 14, fontWeight: '900' },
    skillLabel: { color: '#525252', fontSize: 7, fontWeight: '700', textTransform: 'uppercase' },
    relStack: { gap: 8 },
    relRow: { width: '100%' },
    relLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
    relLabel: { color: '#737373', fontSize: 8, fontWeight: '700' },
    relVal: { color: '#fff', fontSize: 8, fontWeight: '900' },
    relBarBg: { height: 3, backgroundColor: '#222', borderRadius: 1.5 },
    relBarFill: { height: '100%', borderRadius: 1.5 },
    sectionTitle: { color: '#fff', fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 2, opacity: 0.6, marginBottom: 15, marginLeft: 5 },
    grid2x2: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    gridBtn: { width: (width - 60) / 2, flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 50, shadowOpacity: 0.2, shadowRadius: 5 },
    gridBtnEmoji: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },
    emojiText: { fontSize: 20 },
    gridBtnTexts: { marginLeft: 10, flex: 1 },
    gridBtnLabel: { color: '#fff', fontSize: 10, fontWeight: '900' },
    gridBtnSub: { color: 'rgba(255,255,255,0.7)', fontSize: 8, fontWeight: '700' },
    lifestyleBtn: { width: (width - 60) / 2, alignItems: 'center', justifyContent: 'center', paddingVertical: 25, borderRadius: 25 },
    lifestyleIcon: { fontSize: 32, marginBottom: 10 },
    trainBtn: { width: '100%', marginTop: 15, backgroundColor: '#1e3a8a', paddingVertical: 18, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(37,99,235,0.3)' },
    trainBtnText: { color: '#fff', fontWeight: '900', fontSize: 12, letterSpacing: 1 },
    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#121212', height: '80%', borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
    modalHeader: { padding: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#222' },
    modalTitle: { color: '#fff', fontSize: 20, fontWeight: '900', fontStyle: 'italic' },
    modalClose: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center' },
    modalCloseText: { color: '#fff' },
    modalScroll: { padding: 25 },
    modalSection: { color: '#525252', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 15 },
    activityItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', padding: 15, borderRadius: 20, marginBottom: 10 },
    activityIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
    activityTitle: { color: '#fff', fontSize: 14, fontWeight: '900' },
    activitySub: { color: '#525252', fontSize: 10, fontWeight: '700' },
    activityCosts: { alignItems: 'flex-end' },
    activityEnergy: { color: '#ef4444', fontSize: 10, fontWeight: '900' },
    activityCash: { color: '#eab308', fontSize: 10, fontWeight: '900' }
});
