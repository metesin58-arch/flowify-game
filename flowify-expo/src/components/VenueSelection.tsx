
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import { PlayerStats } from '../types';
import { CoinIcon, UsersIcon, TrophyIcon } from './Icons';
import { playClickSound } from '../services/sfx';

const { width } = Dimensions.get('window');

interface Venue {
    id: string;
    name: string;
    capacity: number;
    rentCost: number;
    prestige: number;
    difficulty: number;
}

interface Props {
    player: PlayerStats;
    onConfirm: (venue: Venue, ticketPrice: number) => void;
    onBack: () => void;
}

const VENUE_PREFIXES = ['Kulüp', 'Sahne', 'Arena', 'Salon', 'Teras', 'Stadyum', 'Park', 'Meydan', 'Bar', 'Hangar'];
const VENUE_SUFFIXES = ['Yeraltı', 'Elit', 'Merkez', 'Cadde', 'Yıldız', 'Liman', 'Kule', 'Vadi', 'Sokak', 'Rıhtım'];

export const VenueSelection: React.FC<Props> = ({ player, onConfirm, onBack }) => {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
    const [ticketPrice, setTicketPrice] = useState(50);

    useEffect(() => {
        generateVenues();
    }, [player.careerLevel]);

    const generateVenues = () => {
        const level = player.careerLevel || 1;
        const baseCap = level * 100;
        const newVenues: Venue[] = Array.from({ length: 3 }).map((_, i) => {
            const qualityMod = 1 + (i * 0.5);
            const capacity = Math.floor(baseCap * qualityMod * (0.8 + Math.random() * 0.4));
            let baseRent = 100 * Math.pow(5, i);
            let rent = Math.floor(baseRent * (0.9 + Math.random() * 0.2));
            if (level === 1 && i === 0 && rent > 200) rent = 100;
            if (player.week > 1) rent *= 2;
            const p1 = VENUE_PREFIXES[Math.floor(Math.random() * VENUE_PREFIXES.length)];
            const p2 = VENUE_SUFFIXES[Math.floor(Math.random() * VENUE_SUFFIXES.length)];
            return {
                id: `venue_${Date.now()}_${i}`,
                name: `${p1} ${p2}`,
                capacity: capacity,
                rentCost: rent,
                prestige: Math.min(5, Math.floor(level / 5) + i + 1),
                difficulty: i + 1
            };
        });
        setVenues(newVenues);
    };

    const handleConfirm = () => {
        playClickSound();
        const venue = venues.find(v => v.id === selectedVenueId);
        if (venue) onConfirm(venue, ticketPrice);
    };

    const selectedVenue = venues.find(v => v.id === selectedVenueId);
    const estimatedFillRate = Math.max(0.3, Math.min(1.0, 1.0 - ((ticketPrice - 50) / 200)));
    const estimatedRevenue = selectedVenue ? Math.floor(((selectedVenue.capacity * estimatedFillRate) * ticketPrice) - selectedVenue.rentCost) : 0;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>MEKAN SEÇİMİ</Text>
                <Text style={styles.headerSub}>BÜTÇE: ₺{player.careerCash.toLocaleString()}</Text>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                {venues.map((venue, idx) => {
                    const isSelected = selectedVenueId === venue.id;
                    let tierColor = '#22c55e';
                    if (idx === 1) tierColor = '#eab308';
                    if (idx === 2) tierColor = '#ef4444';

                    return (
                        <TouchableOpacity
                            key={venue.id}
                            activeOpacity={0.8}
                            onPress={() => { playClickSound(); setSelectedVenueId(venue.id); }}
                            style={[styles.card, isSelected && styles.cardSelected]}
                        >
                            <View style={styles.cardHeader}>
                                <View>
                                    <Text style={styles.venueName}>{venue.name.toUpperCase()}</Text>
                                    <Text style={styles.capacityText}>KAPASİTE: {venue.capacity.toLocaleString()}</Text>
                                </View>
                                <View style={styles.priceCol}>
                                    <Text style={styles.rentText}>-₺{venue.rentCost.toLocaleString()}</Text>
                                    <Text style={[styles.tierText, { color: tierColor }]}>
                                        {idx === 0 ? 'NORMAL' : idx === 1 ? 'ZORLU' : 'EFSANE'}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.prestigeStars}>
                                {[...Array(5)].map((_, i) => (
                                    <TrophyIcon key={i} size={12} color={i < venue.prestige ? '#eab308' : '#1a1a1a'} />
                                ))}
                            </View>
                        </TouchableOpacity>
                    );
                })}

                {selectedVenue && (
                    <View style={styles.pricingSection}>
                        <View style={styles.priceHeader}>
                            <Text style={styles.pricingTitle}>BİLET FİYATI</Text>
                            <Text style={styles.priceValue}>₺{ticketPrice}</Text>
                        </View>
                        <Slider
                            style={styles.slider}
                            minimumValue={10}
                            maximumValue={500}
                            step={10}
                            value={ticketPrice}
                            onValueChange={(val) => setTicketPrice(Math.round(val))}
                            minimumTrackTintColor="#1ed760"
                            maximumTrackTintColor="#222"
                            thumbTintColor="#1ed760"
                        />
                        <View style={styles.estimateGrid}>
                            <View>
                                <Text style={styles.estLabel}>DOLULUK TAHMİNİ</Text>
                                <Text style={[styles.estVal, { color: estimatedFillRate > 0.7 ? '#22c55e' : '#eab308' }]}>
                                    %{Math.floor(estimatedFillRate * 100)}
                                </Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.estLabel}>TAHMİNİ KÂR</Text>
                                <Text style={[styles.estVal, { color: estimatedRevenue > 0 ? '#1ed760' : '#ef4444' }]}>
                                    ₺{estimatedRevenue.toLocaleString()}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backText}>GERİ</Text></TouchableOpacity>
                <TouchableOpacity
                    disabled={!selectedVenueId}
                    onPress={handleConfirm}
                    style={[styles.confirmBtn, !selectedVenueId && styles.btnDisabled]}
                >
                    <Text style={styles.confirmText}>DEVAM ET</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#050505' },
    header: { paddingTop: 60, paddingHorizontal: 25, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    headerTitle: { color: '#fff', fontSize: 24, fontWeight: '900', fontStyle: 'italic' },
    headerSub: { color: '#737373', fontSize: 10, fontWeight: '900', marginTop: 4 },
    scroll: { flex: 1 },
    scrollContent: { padding: 25 },
    card: { backgroundColor: '#111', padding: 20, borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    cardSelected: { borderColor: '#1ed760', backgroundColor: 'rgba(30,215,96,0.05)' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    venueName: { color: '#fff', fontSize: 18, fontWeight: '900', fontStyle: 'italic' },
    capacityText: { color: '#737373', fontSize: 10, fontWeight: '900', marginTop: 4 },
    priceCol: { alignItems: 'flex-end' },
    rentText: { color: '#ef4444', fontSize: 13, fontWeight: '900' },
    tierText: { fontSize: 9, fontWeight: '900', marginTop: 4 },
    prestigeStars: { flexDirection: 'row', gap: 4, marginTop: 15 },
    pricingSection: { marginTop: 20, backgroundColor: '#111', padding: 20, borderRadius: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    priceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    pricingTitle: { color: '#737373', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
    priceValue: { color: '#1ed760', fontSize: 24, fontWeight: '900' },
    slider: { width: '100%', height: 40 },
    estimateGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
    estLabel: { color: '#525252', fontSize: 9, fontWeight: '900', marginBottom: 4 },
    estVal: { fontSize: 16, fontWeight: '900' },
    footer: { padding: 25, flexDirection: 'row', gap: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
    backBtn: { flex: 1, backgroundColor: '#1a1a1a', paddingVertical: 18, borderRadius: 20, alignItems: 'center' },
    backText: { color: '#737373', fontWeight: '900', fontSize: 12 },
    confirmBtn: { flex: 2, backgroundColor: '#fff', paddingVertical: 18, borderRadius: 20, alignItems: 'center' },
    confirmText: { color: '#000', fontWeight: '900', fontSize: 12, letterSpacing: 1 },
    btnDisabled: { opacity: 0.3 }
});
