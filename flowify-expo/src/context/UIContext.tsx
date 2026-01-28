
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { CheckIcon, SkullIcon } from '../components/Icons';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ConfirmModalData {
    title: string;
    message: string;
    onConfirm: () => void;
    isOpen: boolean;
}

interface UIContextType {
    showToast: (message: string, type: ToastType) => void;
    showConfirm: (title: string, message: string, onConfirm: () => void) => void;
    closeConfirm: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const useGameUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error("useGameUI must be used within UIProvider");
    return context;
};

const CenteredToast: React.FC<{ toast: Toast | null }> = ({ toast }) => {
    const opacity = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (toast) {
            Animated.sequence([
                Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
                Animated.delay(2100),
                Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
            ]).start();
        }
    }, [toast]);

    if (!toast) return null;

    const color = toast.type === 'success' ? '#1ed760' : toast.type === 'error' ? '#ef4444' : '#3b82f6';

    return (
        <View style={styles.toastContainer} pointerEvents="none">
            <Animated.View style={[styles.toastCard, { opacity, borderColor: color }]}>
                <View style={[styles.toastLine, { backgroundColor: color }]} />
                <View style={[styles.iconCircle, { backgroundColor: color }]}>
                    {toast.type === 'success' ? <CheckIcon size={24} color="#000" /> :
                        toast.type === 'error' ? <SkullIcon size={24} color="#fff" /> :
                            <Text style={styles.infoIcon}>i</Text>}
                </View>
                <View style={styles.toastTextContainer}>
                    <Text style={[styles.toastLabel, { color }]}>
                        {toast.type === 'success' ? 'BAŞARILI' : toast.type === 'error' ? 'HATA' : 'BİLGİ'}
                    </Text>
                    <Text style={styles.toastMessage}>{toast.message}</Text>
                </View>
            </Animated.View>
        </View>
    );
};

const CyberConfirmModal: React.FC<{ data: ConfirmModalData | null, onClose: () => void }> = ({ data, onClose }) => {
    if (!data) return null;

    return (
        <Modal transparent visible={data.isOpen} animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                    <View style={styles.modalLine} />
                    <View style={styles.modalIconBox}>
                        <Text style={styles.modalIconText}>?</Text>
                    </View>
                    <Text style={styles.modalTitle}>{data.title}</Text>
                    <Text style={styles.modalMessage}>{data.message}</Text>
                    <View style={styles.modalActions}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                            <Text style={styles.cancelBtnText}>İPTAL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmBtn} onPress={() => { data.onConfirm(); onClose(); }}>
                            <Text style={styles.confirmBtnText}>ONAYLA</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toast, setToast] = useState<Toast | null>(null);
    const [confirmModal, setConfirmModal] = useState<ConfirmModalData | null>(null);
    const toastIdRef = useRef(0);

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = toastIdRef.current++;
        setToast({ id, message, type });
        setTimeout(() => { if (toastIdRef.current === id + 1) setToast(null); }, 2500);
    }, []);

    const showConfirm = useCallback((title: string, message: string, onConfirm: () => void) => {
        setConfirmModal({ title, message, onConfirm, isOpen: true });
    }, []);

    const closeConfirm = useCallback(() => {
        setConfirmModal(prev => prev ? { ...prev, isOpen: false } : null);
    }, []);

    return (
        <UIContext.Provider value={{ showToast, showConfirm, closeConfirm }}>
            {children}
            <CenteredToast toast={toast} />
            <CyberConfirmModal data={confirmModal} onClose={closeConfirm} />
        </UIContext.Provider>
    );
};

const styles = StyleSheet.create({
    toastContainer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    toastCard: {
        width: '80%',
        backgroundColor: 'rgba(18, 18, 18, 0.95)',
        borderRadius: 16,
        borderWidth: 2,
        padding: 24,
        alignItems: 'center',
        overflow: 'hidden',
    },
    toastLine: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 4,
        borderColor: '#000',
    },
    infoIcon: {
        fontSize: 24,
        fontWeight: '900',
        color: '#fff',
    },
    toastTextContainer: {
        alignItems: 'center',
    },
    toastLabel: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 4,
    },
    toastMessage: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalCard: {
        width: '85%',
        backgroundColor: '#121212',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#eab308',
        padding: 24,
        alignItems: 'center',
        overflow: 'hidden',
    },
    modalLine: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: '#eab308',
    },
    modalIconBox: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#eab308',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 4,
        borderColor: '#000',
    },
    modalIconText: {
        fontSize: 32,
        fontWeight: '900',
        color: '#000',
    },
    modalTitle: {
        color: '#eab308',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 8,
    },
    modalMessage: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 24,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
    },
    cancelBtnText: {
        color: '#a3a3a3',
        fontWeight: '700',
        fontSize: 10,
        letterSpacing: 1,
    },
    confirmBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#eab308',
        alignItems: 'center',
    },
    confirmBtnText: {
        color: '#000',
        fontWeight: '900',
        fontSize: 10,
        letterSpacing: 1,
    },
});
