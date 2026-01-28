
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { loginEmail, loginGuest, registerEmail } from '../services/authService';
import { useGameUI } from '../context/UIContext';

export const AuthScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'login' | 'register'>('login');

    const { showToast } = useGameUI();

    const handleAuth = async () => {
        if (!email || !password) return;
        setLoading(true);
        try {
            if (mode === 'login') {
                await loginEmail(email, password);
            } else {
                await registerEmail(email, password);
            }
        } catch (e: any) {
            showToast(e.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleGuest = async () => {
        setLoading(true);
        try {
            await loginGuest();
        } catch (e: any) {
            showToast(e.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>FLOWIFY</Text>
            <Text style={styles.subtitle}>EFSANENİ YAZMAYA BAŞLA</Text>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="E-posta"
                    placeholderTextColor="#555"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Şifre"
                    placeholderTextColor="#555"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.mainBtn} onPress={handleAuth} disabled={loading}>
                    {loading ? <ActivityIndicator color="#000" /> : (
                        <Text style={styles.mainBtnText}>{mode === 'login' ? 'GİRİŞ YAP' : 'KAYIT OL'}</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.switchBtn} onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
                    <Text style={styles.switchText}>
                        {mode === 'login' ? 'Hesabın yok mu? Kayıt Ol' : 'Zaten hesabın var mı? Giriş Yap'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                    <View style={styles.line} />
                    <Text style={styles.orText}>VEYA</Text>
                    <View style={styles.line} />
                </View>

                <TouchableOpacity style={styles.guestBtn} onPress={handleGuest} disabled={loading}>
                    <Text style={styles.guestBtnText}>MİSAFİR OLARAK DEVAM ET</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', padding: 30 },
    title: { color: '#1ed760', fontSize: 48, fontWeight: '900', fontStyle: 'italic', letterSpacing: -2 },
    subtitle: { color: '#737373', fontSize: 10, fontWeight: '900', letterSpacing: 3, marginBottom: 50 },
    form: { width: '100%' },
    input: {
        backgroundColor: '#121212',
        borderRadius: 12,
        padding: 15,
        color: '#fff',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#333'
    },
    mainBtn: { backgroundColor: '#1ed760', padding: 18, borderRadius: 12, alignItems: 'center' },
    mainBtnText: { color: '#000', fontWeight: '900', fontSize: 16 },
    switchBtn: { marginTop: 20, alignItems: 'center' },
    switchText: { color: '#a3a3a3', fontSize: 12, fontWeight: '700' },
    divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
    line: { flex: 1, height: 1, backgroundColor: '#222' },
    orText: { color: '#555', marginHorizontal: 15, fontSize: 10, fontWeight: '900' },
    guestBtn: { padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#1ed760', alignItems: 'center' },
    guestBtnText: { color: '#1ed760', fontWeight: '900', fontSize: 14 }
});
