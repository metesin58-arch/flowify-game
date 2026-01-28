
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const PRE_CONCERT_SCENARIOS = [
    {
        id: 'soundcheck_fail',
        title: 'TEKNİK ARIZA',
        desc: 'Soundcheck sırasında mikrofon çalışmadı. Sesçi "kabloda temassızlık var" diyor ama pek güven vermiyor.',
        options: [
            { text: 'Kendi mikrofonumu kullanırım.', effects: { rel_team: 2, charisma: 1, energy: -1 }, outcome: 'Profesyonellik kazandırdı. Ekip sana saygı duyuyor.' },
            { text: 'Sesçiye bağırıp çağır.', effects: { rel_team: -3, energy: -2 }, outcome: 'Sinirlerin bozuldu, ekip sana gıcık oldu.' },
            { text: 'Boşver, playback yaparım.', effects: { rel_fans: -3, rel_manager: -1 }, outcome: 'Kolaya kaçtın. Fanlar bunu fark edecek.' }
        ]
    },
    {
        id: 'backstage_fan',
        title: 'KULİSTE ZİYARETÇİ',
        desc: 'Güvenliği aşan bir hayran kulise girdi. "Sadece bir fotoğraf!" diye bağırıyor.',
        options: [
            { text: 'Fotoğraf çekil ve imzala.', effects: { rel_fans: 3, energy: -1 }, outcome: 'Hayran mutluluktan ağladı. Fan kitlen seni seviyor.' },
            { text: 'Güvenliği çağır, atın bunu!', effects: { rel_fans: -2, rel_manager: 1 }, outcome: 'Menajerin güvenliği takdir etti ama fanlar üzgün.' },
            { text: 'Para karşılığı fotoğraf çekil.', effects: { rel_fans: -5, careerCash: 100 }, outcome: 'Para kazandın ama paragöz damgası yedin.' }
        ]
    },
    {
        id: 'label_pressure',
        title: 'YAPIMCI BASKISI',
        desc: 'Menajerin aradı: "Bu geceki konserde o popüler aşk şarkısını söylemezsen sözleşmeyi yakarım!"',
        options: [
            { text: 'Tamam, söyleyeceğim.', effects: { rel_manager: 4, charisma: -2, careerCash: 250 }, outcome: 'Menajerin mutlu, para geldi ama tarzından ödün verdin.' },
            { text: 'Ben rapçiyim, pop söylemem!', effects: { rel_manager: -5, rel_fans: 2, careerCash: -50 }, outcome: 'Dik duruşun fanları coşturdu ama menajerin küplere bindi.' }
        ]
    },
    {
        id: 'gf_drama',
        title: 'SEVGİLİ TRİBİ',
        desc: 'Konsere dakikalar kala sevgilin mesaj attı: "Yine mi konser? Benimle hiç ilgilenmiyorsun!"',
        options: [
            { text: 'Arayıp gönlünü al.', effects: { rel_partner: 3, energy: -2, flow: -1 }, outcome: 'İlişkini kurtardın ama konsere yorgun ve konsantrasyonun bozuk çıkıyorsun.' },
            { text: 'Şu an işim var, sonra konuşuruz.', effects: { rel_partner: -4, energy: 1 }, outcome: 'Kafan rahat sahneye çıktın ama evde kavga var.' }
        ]
    }
];

export const POST_CONCERT_SCENARIOS = [
    {
        id: 'journalist_q',
        title: 'RÖPORTAJ',
        desc: 'Magazin muhabiri mikrofonu uzattı: "Rakibiniz X hakkında ne düşünüyorsunuz? Onun sizden iyi olduğu söyleniyor."',
        options: [
            { text: 'O kim tanımıyorum.', effects: { charisma: 2, rel_fans: 1 }, outcome: 'Efsane cevap! Swag seviyen arttı.' },
            { text: 'Herkesin tarzı farklı, saygı duyarım.', effects: { lyrics: 1, rel_manager: 1 }, outcome: 'Politik bir cevap. Lirik zekan takdir edildi.' },
            { text: 'Mikrofonu elinden alıp fırlat.', effects: { rel_fans: -2, careerCash: -100, rel_partner: -1 }, outcome: 'Skandal! Tazminat ödeyeceksin ve sevgilin utandı.' }
        ]
    },
    {
        id: 'afterparty',
        title: 'AFTER PARTY',
        desc: 'Konser bitti, şehrin en ünlü kulübünde after party var. Ekip seni bekliyor.',
        options: [
            { text: 'Tabii ki! Bu gece dağıtıyoruz!', effects: { rel_team: 4, rel_partner: -2, careerCash: -200, energy: -4 }, outcome: 'Efsane bir geceydi, ekiple kaynaştın ama cüzdan boşaldı.' },
            { text: 'Hayır, eve gidip uyuyacağım.', effects: { rel_team: -2, energy: 2 }, outcome: 'Sıkıcı bulundun ama dinç uyandın.' }
        ]
    }
];

const EFFECT_LABELS: Record<string, string> = {
    rel_manager: 'Menajer',
    rel_team: 'Ekip',
    rel_fans: 'Fanlar',
    rel_partner: 'Aşk',
    careerCash: 'Nakit',
    energy: 'Enerji',
    charisma: 'Karizma',
    flow: 'Flow',
    lyrics: 'Lirik',
    rhythm: 'Ritim'
};

interface ScenarioModalProps {
    scenario: any;
    onOptionSelect: (option: any) => void;
}

export const ScenarioModal: React.FC<ScenarioModalProps> = ({ scenario, onOptionSelect }) => {
    return (
        <Modal transparent animationType="fade">
            <View style={styles.modalBg}>
                <View style={styles.card}>
                    <LinearGradient colors={['#581c87', '#111']} style={styles.cardHeader} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                        <Text style={styles.badge}>SON DAKİKA</Text>
                        <Text style={styles.title}>{scenario.title}</Text>
                    </LinearGradient>

                    <View style={styles.cardBody}>
                        <Text style={styles.desc}>{scenario.desc}</Text>
                        <View style={styles.optionsStack}>
                            {scenario.options.map((opt: any, idx: number) => (
                                <TouchableOpacity key={idx} style={styles.optionBtn} onPress={() => onOptionSelect(opt)}>
                                    <Text style={styles.optionText}>{opt.text}</Text>
                                    <View style={styles.effectsRow}>
                                        {Object.entries(opt.effects || {}).map(([key, val]) => {
                                            const isPos = (val as number) > 0;
                                            return (
                                                <Text key={key} style={[styles.effectText, { color: isPos ? '#22c55e' : '#ef4444' }]}>
                                                    {isPos ? '+' : ''}{key === 'careerCash' ? '₺' : ''}{val as any} {key !== 'careerCash' ? EFFECT_LABELS[key] : ''}
                                                </Text>
                                            );
                                        })}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export const ScenarioResultModal: React.FC<{ outcome: string, onClose: () => void }> = ({ outcome, onClose }) => (
    <Modal transparent animationType="fade">
        <TouchableOpacity activeOpacity={1} style={styles.modalBg} onPress={onClose}>
            <View style={styles.resultBox}>
                <Text style={styles.resultEmoji}>✅</Text>
                <Text style={styles.resultTitle}>SONUÇ</Text>
                <Text style={styles.resultText}>{outcome}</Text>
                <Text style={styles.continueText}>DEVAM ET &rarr;</Text>
            </View>
        </TouchableOpacity>
    </Modal>
);

const styles = StyleSheet.create({
    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center', padding: 30 },
    card: { width: '100%', backgroundColor: '#111', borderRadius: 30, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    cardHeader: { padding: 30, paddingBottom: 20 },
    badge: { color: '#a855f7', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 5 },
    title: { color: '#fff', fontSize: 28, fontWeight: '900', fontStyle: 'italic' },
    cardBody: { padding: 30 },
    desc: { color: '#737373', fontSize: 14, fontWeight: '700', lineHeight: 20, marginBottom: 30 },
    optionsStack: { gap: 12 },
    optionBtn: { backgroundColor: '#1a1a1a', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    optionText: { color: '#fff', fontSize: 13, fontWeight: '900', marginBottom: 6 },
    effectsRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
    effectText: { fontSize: 10, fontWeight: '900', fontStyle: 'italic' },
    resultBox: { backgroundColor: '#111', padding: 40, borderRadius: 30, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)', width: '100%' },
    resultEmoji: { fontSize: 40, marginBottom: 20 },
    resultTitle: { color: '#fff', fontSize: 20, fontWeight: '900', marginBottom: 10 },
    resultText: { color: '#737373', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 30 },
    continueText: { color: '#1ed760', fontSize: 11, fontWeight: '900', letterSpacing: 1 }
});
