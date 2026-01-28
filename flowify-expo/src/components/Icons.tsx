
import React from 'react';
import Svg, { Path, Polyline, Circle, Line, Polygon, Rect, G } from 'react-native-svg';

interface IconProps {
    size?: number;
    color?: string;
    style?: any;
}

export const HomeIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <Path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <Polyline points="9 22 9 12 15 12 15 22" />
    </Svg>
);

export const MicIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <Path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <Path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <Line x1="12" y1="19" x2="12" y2="22" />
        <Line x1="8" y1="22" x2="16" y2="22" />
    </Svg>
);

export const TrophyIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <Path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <Path d="M4 22h16" />
        <Path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <Path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <Path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </Svg>
);

export const DiscIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <Circle cx="12" cy="12" r="10" /><Circle cx="12" cy="12" r="2" />
    </Svg>
);

export const UsersIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><Circle cx="9" cy="7" r="4" /><Path d="M22 21v-2a4 4 0 0 0-3-3.87" /><Path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
);

export const DollarIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <Path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </Svg>
);

export const GameControllerIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <Path d="M19 6h-14c-2.2 0-4 1.8-4 4v4c0 2.2 1.8 4 4 4h14c2.2 0 4-1.8 4-4v-4c0-2.2-1.8-4-4-4z" />
        <Path d="M8 10v4" /><Path d="M6 12h4" /><Circle cx="15" cy="12" r="1" fill={color} /><Circle cx="18" cy="10" r="1" fill={color} />
    </Svg>
);

export const GlobeIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <Circle cx="12" cy="12" r="10" /><Path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><Path d="M2 12h20" />
    </Svg>
);

export const DiamondIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
        <Path d="M4.82397 12L12 19.176L19.176 12L12 4.82397L4.82397 12ZM2.55673 10.4433C1.69677 11.3032 1.69677 12.6968 2.55673 13.5567L10.4433 21.4433C11.3032 22.3032 12.6968 22.3032 13.5567 21.4433L21.4433 13.5567C22.3032 12.6968 22.3032 11.3032 21.4433 10.4433L13.5567 2.55673C12.6968 1.69677 11.3032 1.69677 10.4433 2.55673L2.55673 10.4433Z" />
    </Svg>
);

export const CrownIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
        <Path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V18H19V19Z" />
    </Svg>
);

export const CheckIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <Polyline points="20 6 9 17 4 12" />
    </Svg>
);

export const SkullIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <Circle cx="9" cy="12" r="1" /><Circle cx="15" cy="12" r="1" />
        <Path d="M8 20v2h8v-2" /><Path d="m12.5 17-.5-1-.5 1h1z" /><Path d="M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20" />
    </Svg>
);

export const CoinIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <Circle cx="12" cy="12" r="10" /><Path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><Path d="M12 18V6" />
    </Svg>
);

export const ArrowIcon = ({ size = 24, color = "currentColor", dir, style }: IconProps & { dir?: string }) => {
    let rotation = '0deg';
    if (dir === 'left') rotation = '-90deg';
    else if (dir === 'right') rotation = '90deg';
    else if (dir === 'down') rotation = '180deg';

    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={[{ transform: [{ rotate: rotation }] }, style]}>
            <Path d="M12 2L2 12h7v10h6V12h7L12 2z" />
        </Svg>
    );
};

export const PlayIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
        <Polygon points="5 3 19 12 5 21 5 3" />
    </Svg>
);

export const SpectrumIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <Path d="M3 14v-4" /><Path d="M7 17v-10" /><Path d="M11 20v-16" /><Path d="M15 17v-10" /><Path d="M19 14v-4" />
    </Svg>
);

export const BreakdanceIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <Circle cx="12" cy="7" r="2" /><Path d="M12 9v4l-3 3-2-2" /><Path d="M12 13l3 3 2-2" /><Path d="M5 21l3-3" /><Path d="M19 21l-3-3" /><Path d="M9 14l-4-4" /><Path d="M15 14l4-4" />
    </Svg>
);

export const QuestionMarkIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><Path d="M12 17h.01" />
    </Svg>
);

export const HexagonIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <Path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </Svg>
);

export const RocketIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <Path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <Path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <Path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><Path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </Svg>
);

export const SwordIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <Polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" /><Line x1="13" y1="19" x2="19" y2="13" /><Line x1="16" y1="16" x2="20" y2="20" /><Line x1="19" y1="21" x2="21" y2="19" />
    </Svg>
);

export const ClockIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <Circle cx="12" cy="12" r="10" /><Polyline points="12 6 12 12 16 14" />
    </Svg>
);

export const ArrowUpDownIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
        <Path d="M12 2L16 6H13V12H11V6H8L12 2Z" /><Path d="M12 22L8 18H11V12H13V18H16L12 22Z" />
    </Svg>
);

export const SpadeCardIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
        <Path d="M4 2C2.89543 2 2 2.89543 2 4V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V4C22 2.89543 21.1046 2 20 2H4ZM12 6C12 6 15 10 15 12.5C15 14.5 13.5 15.5 12.5 15.5H13.5L14 17.5H10L10.5 15.5H11.5C10.5 15.5 9 14.5 9 12.5C9 10 12 6 12 6ZM5.5 5.5H7.5V7.5H5.5V5.5ZM16.5 16.5H18.5V18.5H16.5V16.5Z" />
    </Svg>
);

export const PlusIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <Line x1="12" y1="5" x2="12" y2="19" /><Line x1="5" y1="12" x2="19" y2="12" />
    </Svg>
);

export const FourArrowsIcon = ({ size = 24, color = "currentColor", style }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
        <Path d="M12 2L9 5h2v4H7V7l-3 3 3 3v-2h4v4H9l3 3 3-3h-2v-4h4v2l3-3-3-3v2h-4V5h2l-3-3z" />
    </Svg>
);
