
import { Audio } from 'expo-av';

export const SOUND_SOURCES = {
    click: 'https://files.catbox.moe/tk3jff.mp3',
    back: 'https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3',
    money: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',
    success: 'https://files.catbox.moe/ilrtul.mp3',
    error: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
    go: 'https://files.catbox.moe/cl4379.mp3',
    tick: 'https://files.catbox.moe/x98144.mp3',
    rhythm_twister: 'https://files.catbox.moe/i8utl5.mp3',
    correct: 'https://files.catbox.moe/ilrtul.mp3',
    wrong: 'https://files.catbox.moe/ovzrlt.mp3',
    scratch: 'https://files.catbox.moe/npwc6x.mp3'
};

const sounds: Record<string, Audio.Sound> = {};

export const preloadAllSounds = async (onProgress: (progress: number) => void): Promise<void> => {
    const keys = Object.keys(SOUND_SOURCES);
    const total = keys.length;
    let loaded = 0;

    for (const key of keys) {
        try {
            const { sound } = await Audio.Sound.createAsync(
                { uri: SOUND_SOURCES[key as keyof typeof SOUND_SOURCES] },
                { shouldPlay: false }
            );
            sounds[key] = sound;
            loaded++;
            onProgress(Math.floor((loaded / total) * 100));
        } catch (error) {
            console.warn(`Failed to load sound ${key}`, error);
            loaded++;
            onProgress(Math.floor((loaded / total) * 100));
        }
    }
};

export const initAudioContext = async () => {
    await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: false,
    });
};

export const playSound = async (key: string, volume: number = 1.0) => {
    const sound = sounds[key];
    if (sound) {
        try {
            await sound.setVolumeAsync(volume);
            await sound.replayAsync();
        } catch (e) {
            console.warn("Play sound error", e);
        }
    }
};

export const playClickSound = () => playSound('click', 0.5);
export const playBackSound = () => playSound('back', 0.5);
export const playMoneySound = () => playSound('money', 0.6);
export const playWinSound = () => playSound('success', 0.6);
export const playErrorSound = () => playSound('error', 0.4);
export const playGoSound = () => playSound('go', 0.7);
export const playCountdownTick = () => playSound('tick', 0.5);
export const playCorrectSound = () => playSound('correct', 0.7);
export const playWrongSound = () => playSound('wrong', 0.5);
export const playScratchSound = () => playSound('scratch', 0.4);
export const playMusic = (key: string = 'rhythm_twister') => playSound(key, 0.3);
export const stopMusic = () => {
    // Basic stop logic could be added here if we track the loop
};
