
import { SongTrack, GameSequence, TriviaQuestion } from '../types';

// In Native, we can call iTunes API directly without CORS issues
const DIRECT_API_URL = 'https://itunes.apple.com/search';

const shuffle = <T>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

const fetchSongsData = async (term: string, limit: number = 25): Promise<SongTrack[]> => {
    if (!term || term.trim() === '') return [];

    try {
        const url = `${DIRECT_API_URL}?term=${encodeURIComponent(term)}&media=music&entity=song&limit=${limit}&country=TR&lang=tr_tr`;
        const response = await fetch(url);

        if (!response.ok) throw new Error(`iTunes API returned ${response.status}`);
        const rawData = await response.json();

        if (!rawData || !rawData.results || rawData.resultCount === 0) return [];

        return rawData.results
            .filter((item: any) =>
                item.wrapperType === 'track' &&
                item.kind === 'song' &&
                item.previewUrl &&
                item.artworkUrl100
            )
            .map((item: any) => ({
                trackId: item.trackId,
                artistName: item.artistName,
                trackName: item.trackName,
                releaseYear: new Date(item.releaseDate).getFullYear(),
                previewUrl: item.previewUrl.replace('http:', 'https:'),
                artworkUrl100: item.artworkUrl100.replace('http:', 'https:').replace('100x100', '600x600')
            }));
    } catch (error) {
        console.error("Music Fetch Failed:", error);
        return [];
    }
};

export const fetchSongs = async (): Promise<SongTrack[]> => {
    const searchOptions = [
        { query: 'turkce rap', strict: false },
        { query: 'turkish hip hop', strict: false },
        { query: 'sagopa kajmer', strict: true },
        { query: 'ceza', strict: true },
        { query: 'motive', strict: true },
        { query: 'uzi', strict: true },
        { query: 'sefo', strict: true },
        { query: 'lvbel c5', strict: true },
        { query: 'cakal', strict: true },
        { query: 'blok3', strict: true },
        { query: 'sehinsah', strict: true },
        { query: 'khontkar', strict: true },
        { query: 'allame', strict: true },
        { query: 'hidra', strict: true },
        { query: 'ati242', strict: true },
        { query: 'gazapizm', strict: true }
    ];

    const randomOption = searchOptions[Math.floor(Math.random() * searchOptions.length)];
    let songs = await fetchSongsData(randomOption.query, 60);

    if (randomOption.strict) {
        songs = songs.filter(s => s.artistName.toLowerCase().includes(randomOption.query.toLowerCase()));
    }

    if (songs.length < 5) {
        songs = await fetchSongsData('turkce rap hits', 50);
    }

    return shuffle(songs);
};

export const searchSongs = async (query: string, limit: number = 30, strictArtistMatch: boolean = false): Promise<SongTrack[]> => {
    let songs = await fetchSongsData(query, limit);
    if (strictArtistMatch) {
        songs = songs.filter(s => s.artistName.toLowerCase().includes(query.toLowerCase()));
    }
    return songs;
};

export const generateGameSequence = (sourceSongs: SongTrack[]): GameSequence | null => {
    if (!sourceSongs || sourceSongs.length < 5) return null;
    const unique = Array.from(new Map(sourceSongs.map(s => [s.trackId, s])).values());
    if (unique.length < 5) return null;
    const pool = shuffle(unique);
    return {
        startSong: pool[0],
        targetSongs: pool.slice(1, 21)
    };
};

export const generateTriviaQuestions = (sourceSongs: SongTrack[], count: number = 10): TriviaQuestion[] => {
    if (!sourceSongs || sourceSongs.length < 4) return [];
    const unique = Array.from(new Map(sourceSongs.map(s => [s.trackId, s])).values());
    if (unique.length < 4) return [];
    const questions: TriviaQuestion[] = [];
    const pool = shuffle(unique);
    const maxQ = Math.min(count, pool.length);

    for (let i = 0; i < maxQ; i++) {
        const correct = pool[i];
        const others = pool.filter(s => s.trackId !== correct.trackId);
        if (others.length >= 3) {
            const wrongs = shuffle(others).slice(0, 3);
            questions.push({
                correctSong: correct,
                options: shuffle([correct, ...wrongs])
            });
        }
    }
    return questions;
};
