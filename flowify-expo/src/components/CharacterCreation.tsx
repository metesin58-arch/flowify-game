
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { CharacterAppearance, Gender, SongTrack, PlayerStats } from '../types';
import { INITIAL_STATS } from '../constants';
import { Avatar } from './Avatar';

interface Props {
    onCreate: (name: string, gender: Gender, appearance: CharacterAppearance, favoriteSong: SongTrack | null) => void;
    isEditing?: boolean;
    initialData?: PlayerStats;
    ownedUpgrades?: Record<string, number>;
}

export const CharacterCreation: React.FC<Props> = ({ onCreate, isEditing, initialData }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [gender, setGender] = useState<Gender>(initialData?.gender || 'male');
    const [appearance, setAppearance] = useState<CharacterAppearance>(initialData?.appearance || INITIAL_STATS.appearance);

    const handleFinish = () => {
        if (!name.trim()) return;
        onCreate(name, gender, appearance, initialData?.favoriteSong || null);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>{isEditing ? 'DÜZENLE' : 'KARAKTERİNİ OLUŞTUR'}</Text>

            <View style={styles.avatarPreview}>
                <Avatar appearance={appearance} size={250} />
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>SANATÇI ADIN</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Kralın Adı..."
                    placeholderTextColor="#555"
                />

                <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
                    <Text style={styles.finishBtnText}>{isEditing ? 'KAYDET' : 'BAŞLA'}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    content: { padding: 30, alignItems: 'center', justifyContent: 'center' },
    title: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 1, marginBottom: 30 },
    avatarPreview: { marginBottom: 30, height: 300, justifyContent: 'center' },
    form: { width: '100%' },
    label: { color: '#a3a3a3', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 10 },
    input: {
        backgroundColor: '#121212',
        borderRadius: 12,
        padding: 15,
        color: '#fff',
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#333',
        fontSize: 18,
        fontWeight: '700'
    },
    finishBtn: { backgroundColor: '#1ed760', padding: 18, borderRadius: 12, alignItems: 'center' },
    finishBtnText: { color: '#000', fontWeight: '900', fontSize: 16 }
});
