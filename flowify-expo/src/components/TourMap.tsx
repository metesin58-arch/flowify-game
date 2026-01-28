
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, Platform } from 'react-native';
import Svg, { Path, Circle, G, Line, Defs, Filter, FeGaussianBlur, FeMerge, FeMergeNode, Text as SvgText } from 'react-native-svg';
import { PlayerStats, CityKey } from '../types';
import { CITIES } from '../constants';
import { playClickSound, playErrorSound, playWinSound } from '../services/sfx';
import { canUnlockCity } from '../services/gameLogic';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ISLANDS: Record<CityKey, { path: string; color: string; cx: number; cy: number; labelY: number }> = {
    eskisehir: {
        path: "M 100,400 L 140,390 L 150,420 L 110,440 L 90,420 Z",
        color: "#fbbf24", cx: 120, cy: 415, labelY: 460
    },
    bursa: {
        path: "M 180,300 L 240,280 L 270,320 L 230,350 L 170,330 Z",
        color: "#22c55e", cx: 220, cy: 315, labelY: 360
    },
    ankara: {
        path: "M 350,250 L 420,230 L 460,260 L 440,310 L 370,320 L 340,280 Z",
        color: "#ef4444", cx: 400, cy: 275, labelY: 330
    },
    izmir: {
        path: "M 550,350 L 620,330 L 670,360 L 650,400 L 580,410 L 540,380 Z",
        color: "#00ccff", cx: 605, cy: 370, labelY: 425
    },
    istanbul: {
        path: "M 420,100 L 480,40 L 540,60 L 560,110 L 520,150 L 440,140 Z",
        color: "#a855f7", cx: 490, cy: 100, labelY: 160
    }
};

const CONNECTIONS = [
    { from: 'eskisehir', to: 'bursa' },
    { from: 'bursa', to: 'ankara' },
    { from: 'ankara', to: 'izmir' },
    { from: 'izmir', to: 'istanbul' }
];

interface Props {
    player: PlayerStats;
    onSelectCity: (city: CityKey) => void;
    onClose: () => void;
}

export const TourMap: React.FC<Props> = ({ player, onSelectCity, onClose }) => {
    const [selectedPreview, setSelectedPreview] = useState<CityKey | null>(null);
    const floatAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, { toValue: 1, duration: 3000, useNativeDriver: true }),
                Animated.timing(floatAnim, { toValue: 0, duration: 3000, useNativeDriver: true })
            ])
        ).start();
    }, []);

    const handleCityClick = (cityId: CityKey) => {
        const isUnlocked = player.unlockedCities.includes(cityId);
        const canUnlock = canUnlockCity(cityId, player);

        if (isUnlocked || canUnlock) {
            playClickSound();
            if (selectedPreview === cityId && isUnlocked) {
                playWinSound();
                onSelectCity(cityId);
            } else {
                setSelectedPreview(cityId);
            }
        } else {
            playErrorSound();
            setSelectedPreview(cityId);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>HANGİ ŞEHİR?</Text>
                    <View style={styles.statusRow}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>UYDU BAĞLANTISI AKTİF</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}><Text style={styles.closeText}>✕</Text></TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                contentContainerStyle={styles.mapScroll}
                showsHorizontalScrollIndicator={false}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.mapPlane}>
                        <Svg viewBox="0 0 1000 600" width={1000} height={600} style={styles.svg}>
                            <Defs>
                                <Filter id="neon-glow">
                                    <FeGaussianBlur stdDeviation="5" result="blur" />
                                    <FeMerge>
                                        <FeMergeNode in="blur" />
                                        <FeMergeNode in="SourceGraphic" />
                                    </FeMerge>
                                </Filter>
                            </Defs>

                            {/* Connections */}
                            {CONNECTIONS.map((conn, i) => {
                                const start = ISLANDS[conn.from as CityKey];
                                const end = ISLANDS[conn.to as CityKey];
                                const isUnlocked = player.unlockedCities.includes(conn.to as CityKey);
                                return (
                                    <Line
                                        key={i}
                                        x1={start.cx} y1={start.cy} x2={end.cx} y2={end.cy}
                                        stroke={isUnlocked ? end.color : '#222'}
                                        strokeWidth={3}
                                        strokeDasharray="10 5"
                                        opacity={isUnlocked ? 0.6 : 0.2}
                                    />
                                );
                            })}

                            {/* Islands */}
                            {Object.keys(ISLANDS).map((key, index) => {
                                const cityId = key as CityKey;
                                const data = ISLANDS[cityId];
                                const isUnlocked = player.unlockedCities.includes(cityId);
                                const isSelected = selectedPreview === cityId;
                                const isCurrent = player.currentCity === cityId;

                                return (
                                    <G key={cityId} onPress={() => handleCityClick(cityId)}>
                                        {isSelected && <Circle cx={data.cx} cy={data.cy} r={60} fill={data.color} opacity={0.15} filter="url(#neon-glow)" />}
                                        <Path
                                            d={data.path}
                                            fill={isCurrent ? `${data.color}44` : isSelected ? 'rgba(255,255,255,0.1)' : 'rgba(10,10,10,0.9)'}
                                            stroke={isCurrent ? '#fff' : isUnlocked ? data.color : '#333'}
                                            strokeWidth={isCurrent ? 4 : 2}
                                            filter={isCurrent ? 'url(#neon-glow)' : undefined}
                                        />
                                        <G transform={`translate(${data.cx}, ${data.cy})`}>
                                            {isCurrent && <Circle r={5} fill="#fff" filter="url(#neon-glow)" />}
                                            <G transform={`translate(0, ${data.labelY - data.cy})`}>
                                                <Path d="M -45,-12 L 35,-12 L 45,0 L 35,12 L -45,12 L -55,0 Z" fill="#000" stroke={isUnlocked ? data.color : '#333'} />
                                                <SvgText x="0" y="4" textAnchor="middle" fill={isUnlocked ? '#fff' : '#555'} fontSize="10" fontWeight="900">{CITIES[cityId].name.toUpperCase()}</SvgText>
                                            </G>
                                        </G>
                                    </G>
                                );
                            })}
                        </Svg>
                    </View>
                </ScrollView>
            </ScrollView>

            {selectedPreview && (
                <View style={styles.footerPanel}>
                    <View style={styles.footerInfo}>
                        <View>
                            <Text style={[styles.footerName, { color: ISLANDS[selectedPreview].color }]}>{CITIES[selectedPreview].name.toUpperCase()}</Text>
                            <Text style={styles.footerStatus}>
                                {player.unlockedCities.includes(selectedPreview) ? 'AÇIK BÖLGE' : 'KİLİTLİ'}
                            </Text>
                        </View>
                        <View style={styles.footerStats}>
                            <Text style={styles.multiText}>x{CITIES[selectedPreview].multiplier} GELİR</Text>
                            <Text style={styles.rentText}>-₺{CITIES[selectedPreview].weeklyCost} RANT</Text>
                        </View>
                    </View>

                    {!player.unlockedCities.includes(selectedPreview) && !canUnlockCity(selectedPreview, player) && (
                        <View style={styles.reqBox}>
                            <Text style={styles.reqTitle}>GEREKSİNİM</Text>
                            <Text style={styles.reqText}>{CITIES[selectedPreview].unlockRequirements.description}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.actionBtn, (!player.unlockedCities.includes(selectedPreview) && !canUnlockCity(selectedPreview, player)) && styles.btnDisabled]}
                        onPress={() => onSelectCity(selectedPreview)}
                        disabled={!player.unlockedCities.includes(selectedPreview) && !canUnlockCity(selectedPreview, player)}
                    >
                        <Text style={styles.actionBtnText}>
                            {player.currentCity === selectedPreview ? 'BURADASIN' : player.unlockedCities.includes(selectedPreview) ? 'GİT' : 'BÖLGEYİ AÇ'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#050505' },
    header: { position: 'absolute', top: 50, left: 20, right: 20, zIndex: 100, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { color: '#fff', fontSize: 24, fontWeight: '900', fontStyle: 'italic' },
    statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e', marginRight: 8 },
    statusText: { color: '#737373', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
    closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
    closeText: { color: '#fff', fontWeight: 'bold' },
    mapScroll: { minWidth: 1000 },
    mapPlane: { paddingTop: 150, paddingBottom: 250, paddingLeft: 50 },
    svg: { backgroundColor: 'transparent' },
    footerPanel: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(5,5,5,0.95)', padding: 30, borderTopLeftRadius: 30, borderTopRightRadius: 30, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
    footerInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    footerName: { fontSize: 32, fontWeight: '900', fontStyle: 'italic' },
    footerStatus: { color: '#737373', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
    footerStats: { alignItems: 'flex-end' },
    multiText: { color: '#fff', fontSize: 18, fontWeight: '900' },
    rentText: { color: '#ef4444', fontSize: 12, fontWeight: '900' },
    reqBox: { backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 15, borderRadius: 15, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)' },
    reqTitle: { color: '#ef4444', fontSize: 9, fontWeight: '900', marginBottom: 4 },
    reqText: { color: '#fff', fontSize: 11, fontWeight: '700' },
    actionBtn: { backgroundColor: '#fff', paddingVertical: 18, borderRadius: 20, alignItems: 'center' },
    actionBtnText: { color: '#000', fontWeight: '900', letterSpacing: 2 },
    btnDisabled: { opacity: 0.3 }
});
