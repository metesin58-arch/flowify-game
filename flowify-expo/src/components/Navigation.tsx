
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeIcon, UsersIcon, DollarIcon, GameControllerIcon, GlobeIcon } from './Icons';
import { playClickSound } from '../services/sfx';
import { TabType } from '../types';

interface Props {
    activeTab: TabType;
    setTab: (t: TabType) => void;
}

export const Navigation: React.FC<Props> = ({ activeTab, setTab }) => {
    const insets = useSafeAreaInsets();

    const navItems = [
        { id: 'hub', label: 'PROFİL', Icon: HomeIcon, activeColor: '#eab308' },
        { id: 'arcade', label: 'ARCADE', Icon: GameControllerIcon, activeColor: '#9333ea' },
        { id: 'online', label: 'ONLINE', Icon: GlobeIcon, activeColor: '#2563eb' },
        { id: 'nightlife', label: 'CASINO', Icon: DollarIcon, activeColor: '#1ed760' },
        { id: 'social', label: 'SOSYAL', Icon: UsersIcon, activeColor: '#db2777' }
    ];

    const handleTabClick = (id: TabType) => {
        playClickSound();
        setTab(id);
    };

    return (
        <View style={[styles.wrapper, { paddingBottom: insets.bottom + 10 }]}>
            <View style={styles.container}>
                {navItems.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <TouchableOpacity
                            key={tab.id}
                            onPress={() => handleTabClick(tab.id as TabType)}
                            style={styles.navItem}
                            activeOpacity={0.7}
                        >
                            <View style={[
                                styles.iconContainer,
                                isActive && { backgroundColor: tab.activeColor, transform: [{ translateY: -12 }, { scale: 1.1 }] }
                            ]}>
                                <tab.Icon size={20} color={isActive ? '#fff' : '#737373'} />
                            </View>

                            {isActive && (
                                <Text style={styles.label}>
                                    {tab.label}
                                </Text>
                            )}
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    container: {
        flexDirection: 'row',
        backgroundColor: 'rgba(20, 20, 20, 0.95)',
        borderRadius: 40,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        width: '100%',
        maxWidth: 400,
        justifyContent: 'space-between',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 50,
    },
    iconContainer: {
        padding: 10,
        borderRadius: 25,
    },
    label: {
        color: '#fff',
        fontSize: 8,
        fontWeight: '900',
        letterSpacing: 1,
        position: 'absolute',
        bottom: -2,
    }
});
