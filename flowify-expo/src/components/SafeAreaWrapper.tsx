
import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View, Platform, ViewStyle } from 'react-native';

interface Props {
    children: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
    bg?: string;
    className?: string; // For compatibility with ported code
}

export const SafeAreaWrapper: React.FC<Props> = ({ children, style, bg = '#000' }) => {
    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
            <StatusBar barStyle="light-content" />
            <View style={[styles.container, style]}>
                {children}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    }
});
