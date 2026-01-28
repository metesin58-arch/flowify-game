
import React, { useMemo } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, {
    Path, Defs, LinearGradient, Stop, Filter,
    FeGaussianBlur, Ellipse, G, Rect, Circle, Text as SvgText, Image as SvgImage
} from 'react-native-svg';
import { CharacterAppearance, Gender } from '../types';
import { HEAD_OPTIONS } from '../constants';

interface AvatarProps {
    appearance: CharacterAppearance;
    gender?: Gender;
    style?: any;
    size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ appearance, gender = 'male', style, size = 300 }) => {
    const safeAppearance = appearance || {
        headIndex: 0,
        skinColor: '#f1c27d',
        shirtColor: '#333333',
        pantsColor: '#1a1a1a',
        shoesColor: '#ffffff',
        clothingStyle: 0,
        pantsStyle: 0,
        hatIndex: 0,
        chainIndex: 0,
        shoeStyle: 0
    };

    const {
        headIndex, skinColor, shirtColor, pantsColor, shoesColor, clothingStyle, pantsStyle,
        hatIndex = 0, chainIndex = 0, shoeStyle = 0
    } = safeAppearance;

    const styleInt = typeof clothingStyle === 'number' ? clothingStyle : 0;
    const pantsInt = typeof pantsStyle === 'number' ? pantsStyle : 0;
    const shoeInt = typeof shoeStyle === 'number' ? shoeStyle : 0;

    const headImageSrc = HEAD_OPTIONS[headIndex] || HEAD_OPTIONS[0];
    const uid = useMemo(() => Math.random().toString(36).substring(2, 9), []);

    const getHeadYOffset = (index: number) => {
        if (index === 1) return 10;
        if (index === 5) return 8;
        return 0;
    };

    const headY = -110 + getHeadYOffset(headIndex);

    // Note: Complex SVG filters like feSpecularLighting are hit or miss in React Native SVG.
    // I'll stick to basic shapes and gradients for reliability.

    return (
        <View style={[styles.container, { height: size, width: size * 0.8 }, style]}>
            <Svg viewBox="0 0 200 400" width="100%" height="100%">
                <Defs>
                    <LinearGradient id={`skin-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor={skinColor} stopOpacity="0.9" />
                        <Stop offset="40%" stopColor={skinColor} stopOpacity="1" />
                        <Stop offset="100%" stopColor={skinColor} stopOpacity="0.8" />
                    </LinearGradient>

                    <LinearGradient id={`gold-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="#FFD700" />
                        <Stop offset="50%" stopColor="#FDB931" />
                        <Stop offset="100%" stopColor="#996515" />
                    </LinearGradient>

                    <LinearGradient id={`silver-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="#fff" />
                        <Stop offset="50%" stopColor="#e0e0e0" />
                        <Stop offset="100%" stopColor="#757575" />
                    </LinearGradient>
                </Defs>

                <Ellipse cx="100" cy="380" rx="60" ry="10" fill="black" opacity="0.3" />

                <G transform="translate(100, 390) scale(0.75)">
                    <G>
                        {/* PANTS */}
                        <G transform="translate(0, -140)">
                            {pantsInt === 0 && (
                                <G>
                                    <Path d="M -38 0 L 0 0 L -5 35 L -22 135 L -48 135 L -38 0 Z" fill={pantsColor} />
                                    <Path d="M 38 0 L 0 0 L 5 35 L 22 135 L 48 135 L 38 0 Z" fill={pantsColor} />
                                    <Path d="M -5 30 L 5 30 L 0 40 Z" fill={pantsColor} />
                                </G>
                            )}
                            {pantsInt === 1 && (
                                <G>
                                    <Path d="M -42 0 L 0 0 L -8 40 L -18 125 Q -30 140 -50 125 Z" fill={pantsColor} />
                                    <Path d="M 42 0 L 0 0 L 8 40 L 18 125 Q 30 140 50 125 Z" fill={pantsColor} />
                                    <Path d="M -8 35 Q 0 50 8 35" fill={pantsColor} />
                                    <Rect x="-48" y="123" width="28" height="14" rx="3" fill={pantsColor} stroke="black" strokeWidth="0.5" />
                                    <Rect x="20" y="123" width="28" height="14" rx="3" fill={pantsColor} stroke="black" strokeWidth="0.5" />
                                </G>
                            )}
                            {pantsInt === 2 && (
                                <G>
                                    <Path d="M -45 0 L 0 0 L -8 45 L -25 130 L -55 130 Z" fill={pantsColor} />
                                    <Path d="M 45 0 L 0 0 L 8 45 L 25 130 L 55 130 Z" fill={pantsColor} />
                                    <Path d="M -8 40 Q 0 55 8 40" fill={pantsColor} />
                                    <Rect x="-58" y="45" width="16" height="40" rx="3" fill={pantsColor} stroke="black" strokeWidth="0.5" />
                                    <Rect x="42" y="45" width="16" height="40" rx="3" fill={pantsColor} stroke="black" strokeWidth="0.5" />
                                </G>
                            )}

                            {/* SHOES */}
                            <G transform="translate(0, 10)">
                                {shoeInt === 0 && (
                                    <G>
                                        <Path d="M -50 120 L -20 120 L -20 138 Q -22 145 -50 142 Z" fill={shoesColor} />
                                        <Path d="M -52 140 L -18 140 L -18 148 L -52 148 Z" fill="#eee" />
                                        <Path d="M 20 120 L 50 120 L 50 138 Q 22 145 20 142 Z" fill={shoesColor} />
                                        <Path d="M 18 140 L 52 140 L 52 148 L 18 148 Z" fill="#eee" />
                                    </G>
                                )}
                                {shoeInt === 1 && (
                                    <G>
                                        <Path d="M -52 115 L -18 115 L -16 145 L -54 145 Z" fill={shoesColor} stroke="black" strokeWidth="0.5" />
                                        <Path d="M -55 145 L -15 145 L -15 152 L -55 152 Z" fill="#333" />
                                        <Path d="M 18 115 L 52 115 L 54 145 L 16 145 Z" fill={shoesColor} stroke="black" strokeWidth="0.5" />
                                        <Path d="M 15 145 L 55 145 L 55 152 L 15 152 Z" fill="#333" />
                                    </G>
                                )}
                                {shoeInt === 2 && (
                                    <G>
                                        <Path d="M -48 125 L -20 125 L -18 142 L -50 142 Z" fill={shoesColor} />
                                        <Rect x="-42" y="125" width="14" height="5" fill="#ffd700" />
                                        <Path d="M 20 125 L 48 125 L 50 142 L 18 142 Z" fill={shoesColor} />
                                        <Rect x="28" y="125" width="14" height="5" fill="#ffd700" />
                                    </G>
                                )}
                            </G>
                        </G>

                        {/* TORSO */}
                        <G transform="translate(0, -250)">
                            {styleInt === 0 && ( // T-shirt
                                <G>
                                    <Path d="M -48 0 L 48 0 L 42 125 L -42 125 Z" fill={shirtColor} />
                                </G>
                            )}
                            {styleInt === 1 && ( // Hoodie
                                <G>
                                    <Path d="M -28 -12 L 28 -12 L 40 10 L -40 10 Z" fill={shirtColor} opacity={0.8} />
                                    <Path d="M -52 0 L 52 0 L 46 122 L -46 122 Z" fill={shirtColor} />
                                </G>
                            )}
                            {styleInt === 2 && ( // Jacket
                                <G>
                                    <Path d="M -32 0 L 32 0 L 30 115 L -30 115 Z" fill="#eee" />
                                    <Path d="M -55 -5 L -18 -5 L -20 120 L -48 115 Q -60 50 -55 -5 Z" fill={shirtColor} />
                                    <Path d="M 55 -5 L 18 -5 L 20 120 L 48 115 Q 60 50 55 -5 Z" fill={shirtColor} />
                                </G>
                            )}
                            {/* (Other styles truncated for initial port) */}
                            {styleInt >= 3 && ( // Fallback to T-shirt for others for now
                                <G>
                                    <Path d="M -48 0 L 48 0 L 42 125 L -42 125 Z" fill={shirtColor} />
                                </G>
                            )}
                        </G>

                        {/* ARMS */}
                        <G transform="translate(0, -245)">
                            <G transform="rotate(5, -45, 10)">
                                <Path d="M -48 0 L -68 0 L -62 90 L -42 90 Z" fill={shirtColor} />
                                <Path d="M -62 90 L -42 90 L -44 110 L -60 110 Z" fill={`url(#skin-${uid})`} />
                            </G>
                            <G transform="rotate(-5, 45, 10)">
                                <Path d="M 48 0 L 68 0 L 62 90 L 42 90 Z" fill={shirtColor} />
                                <Path d="M 62 90 L 42 90 L 44 110 L 60 110 Z" fill={`url(#skin-${uid})`} />
                            </G>
                        </G>

                        {/* CHAINS */}
                        <G transform="translate(0, -250)">
                            {chainIndex === 1 && <Path d="M -18 0 Q 0 45 18 0" stroke={`url(#gold-${uid})`} strokeWidth="3" fill="none" />}
                            {chainIndex === 2 && <Path d="M -22 0 Q 0 55 22 0" stroke={`url(#gold-${uid})`} strokeWidth="7" fill="none" />}
                            {chainIndex === 3 && (
                                <G>
                                    <Path d="M -24 0 Q 0 65 24 0" stroke={`url(#silver-${uid})`} strokeWidth="6" fill="none" />
                                    <Circle cx="0" cy="35" r="12" fill="#b0e0e6" stroke="#fff" strokeWidth="1" />
                                </G>
                            )}
                        </G>

                        {/* HEAD */}
                        <G transform="translate(0, -250)">
                            <Rect x="-14" y="-15" width="28" height="20" fill={`url(#skin-${uid})`} opacity={0.8} />
                            <SvgImage
                                href={{ uri: headImageSrc }}
                                x="-55"
                                y={headY}
                                width="110"
                                height="110"
                            />

                            {/* HATS */}
                            {hatIndex === 1 && (
                                <G transform="translate(0, -112) scale(1.65)">
                                    <Path d="M -32 8 Q 0 -35 32 8" fill="#DC2626" />
                                    <Path d="M -33 8 L 33 8 L 33 20 L -33 20 Z" fill="#991B1B" />
                                </G>
                            )}
                        </G>
                    </G>
                </G>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-end',
    }
});
