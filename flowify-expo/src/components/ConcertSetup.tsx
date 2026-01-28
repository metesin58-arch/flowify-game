
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
import { fetchSongs, searchSongs } from '../services/musicService';
import { SongTrack, PlayerStats } from '../types';
import { DiscIcon, CheckIcon } from './Icons';
import { playClickSound, playErrorSound } from '../services/sfx';
import { useGameUI } from '../context/UIContext';

interface Props {
    player: PlayerStats;
    onComplete: (setlist: SongTrack[]) => void;
    onBack: () => void;
}

export const ConcertSetup: React.FC<Props> = ({ player, onComplete, onBack }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [songs, setSongs] = useState<SongTrack[]>([]);
    const [setlist, setSetlist] = useState<SongTrack[]>([]);
    const [loading, setLoading] = useState(false);
    const { showToast } = useGameUI();

    useEffect(() => {
        loadRecommendations();
    }, []);

    const loadRecommendations = async () => {
        setLoading(true);
        try {
            let data: SongTrack[] = [];
            if (player.favoriteSong) {
                data = await searchSongs(player.favoriteSong.artistName);
            } else {
                data = await fetchSongs();
            }
            const unique = Array.from(new Map(data.map(s => [s.trackId, s])).values()).slice(0, 12);
            setSongs(unique);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        playClickSound();
        if (!searchQuery.trim()) return;
        setLoading(true);
        try {
            const data = await searchSongs(searchQuery);
            setSongs(data);
        } catch (e) {
            showToast("Arama başarısız oldu", 'error');
        } finally {
            setLoading(false);
        }
    };

    const toggleSong = (song: SongTrack) => {
        playClickSound();
        const exists = setlist.find(s => s.trackId === song.trackId);
        if (exists) {
            setSetlist(prev => prev.filter(s => s.trackId !== song.trackId));
        } else {
            if (setlist.length >= 5) {
                showToast("Maksimum 5 parça seçebilirsin!", 'error');
                playErrorSound();
                return;
            }
            setSetlist(prev => [...prev, song]);
        }
    };

    const handleComplete = () => {
        playClickSound();
        if (setlist.length > 0) {
            onComplete(setlist);
        } else {
            showToast("En az 1 şarkı seçmelisin!", 'error');
            playErrorSound();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>DJ SET-UP</Text>
                    <Text style={styles.headerSub}>SETLIST ({setlist.length}/5)</Text>
                </View>
                <View style={styles.discBox}>
                    <DiscIcon size={24} color="#a855f7" />
                </View>
            </View>

            <View style={styles.searchBar}>
                <TextInput
                    style={styles.input}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Parça veya sanatçı ara..."
                    placeholderTextColor="#525252"
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity onPress={handleSearch} style={styles.searchBtn}>
                    <Text style={styles.searchBtnText}>ARA</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                {loading ? (
                    <View style={styles.loadingBox}><ActivityIndicator color="#a855f7" /></View>
                ) : (
                    <View style={styles.grid}>
                        {songs.map(song => {
                            const isSelected = setlist.some(s => s.trackId === song.trackId);
                            return (
                                <TouchableOpacity
                                    key={song.trackId}
                                    style={[styles.songCard, isSelected && styles.songCardActive]}
                                    onPress={() => toggleSong(song)}
                                    activeOpacity={0.8}
                                >
                                    <Image source={{ uri: song.artworkUrl100 }} style={styles.artwork} />
                                    <View style={styles.songInfo}>
                                        <Text style={styles.songName} numberOfLines={1}>{song.trackName}</Text>
                                        <Text style={styles.artistName} numberOfLines={1}>{song.artistName}</Text>
                                    </View>
                                    {isSelected && (
                                        <View style={styles.checkOverlay}>
                                            <View style={styles.checkBox}><CheckIcon size={16} color="#000" /></View>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backText}>GERİ</Text></TouchableOpacity>
                <TouchableOpacity
                    disabled={setlist.length === 0}
                    onPress={handleComplete}
                    style={[styles.startBtn, setlist.length === 0 && styles.btnDisabled]}
                >
                    <Text style={styles.startText}>SAHNEYE ÇIK ({setlist.length})</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#050505' },
    header: { paddingTop: 60, paddingHorizontal: 25, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { color: '#fff', fontSize: 24, fontWeight: '900', fontStyle: 'italic' },
    headerSub: { color: '#737373', fontSize: 10, fontWeight: '900', marginTop: 4 },
    discBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(168,85,247,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(168,85,247,0.2)' },
    searchBar: { flexDirection: 'row', paddingHorizontal: 25, gap: 10, marginBottom: 20 },
    input: { flex: 1, backgroundColor: '#111', borderRadius: 15, paddingHorizontal: 15, paddingVertical: 12, color: '#fff', fontSize: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    searchBtn: { backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 20, justifyContent: 'center' },
    searchBtnText: { color: '#000', fontWeight: '900', fontSize: 11 },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
    loadingBox: { height: 200, alignItems: 'center', justifyContent: 'center' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    songCard: { width: (width - 50) / 2, aspectRatio: 1, borderRadius: 20, overflow: 'hidden', backgroundColor: '#111' },
    songCardActive: { borderWidth: 3, borderColor: '#1ed760' },
    artwork: { ...StyleSheet.absoluteFillObject, opacity: 0.6 },
    songInfo: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', padding: 12, backgroundColor: 'rgba(0,0,0,0.3)' },
    songName: { color: '#fff', fontSize: 12, fontWeight: '900' },
    artistName: { color: '#737373', fontSize: 9, fontWeight: '700' },
    checkOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(30,215,96,0.2)' },
    checkBox: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#1ed760', alignItems: 'center', justifyContent: 'center' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 25, flexDirection: 'row', gap: 10, backgroundColor: 'rgba(0,0,0,0.85)' },
    backBtn: { flex: 1, backgroundColor: '#1a1a1a', paddingVertical: 18, borderRadius: 20, alignItems: 'center' },
    backText: { color: '#737373', fontWeight: '900', fontSize: 12 },
    startBtn: { flex: 2, backgroundColor: '#1ed760', paddingVertical: 18, borderRadius: 20, alignItems: 'center' },
    startText: { color: '#000', fontWeight: '900', fontSize: 12, letterSpacing: 1 },
    btnDisabled: { opacity: 0.3 }
});
