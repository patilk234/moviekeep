import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import type { Watchlist, Movie } from '../types';
import {
    saveWatchlists,
    saveCustomMovies,
    loadUserData,
    subscribeToUserData,
    signInWithGoogle,
    signOut,
    onAuthChange
} from '../services/firebase';

// UUID generator with fallback for non-secure contexts (HTTP)
const generateUUID = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback for non-secure contexts
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// Constant IDs for default lists
export const ALREADY_WATCHED_ID = 'already-watched';
export const CUSTOM_MOVIES_ID = 'custom-movies';

interface AppContextType {
    user: User | null;
    watchlists: Watchlist[];
    customMovies: Movie[];
    loading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    createWatchlist: (name: string) => void;
    deleteWatchlist: (id: string) => void;
    addMovieToWatchlist: (watchlistId: string, movie: Movie) => void;
    removeMovieFromWatchlist: (watchlistId: string, movieId: number) => void;
    markAsWatched: (fromListId: string, movie: Movie) => void;
    moveMovieToWatchlist: (fromListId: string, toListId: string, movieId: number) => void;
    addCustomMovie: (movie: Omit<Movie, 'id'>) => Movie;
    getMovie: (id: number) => Movie | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Default lists
const getDefaultLists = (): Watchlist[] => [
    { id: ALREADY_WATCHED_ID, name: 'Already Watched', movieIds: [], createdAt: 0 },
    { id: CUSTOM_MOVIES_ID, name: 'My Custom Movies', movieIds: [], createdAt: 1 },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
    const [customMovies, setCustomMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthChange((authUser) => {
            setUser(authUser);
            if (!authUser) {
                // User logged out - clear data
                setWatchlists([]);
                setCustomMovies([]);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    // Load user data when authenticated
    useEffect(() => {
        if (!user) return;

        const initData = async () => {
            setLoading(true);
            const data = await loadUserData(user.uid);

            let lists = data.watchlists;
            const hasAlreadyWatched = lists.some((l: Watchlist) => l.id === ALREADY_WATCHED_ID);
            const hasCustomMovies = lists.some((l: Watchlist) => l.id === CUSTOM_MOVIES_ID);

            if (!hasAlreadyWatched || !hasCustomMovies) {
                const defaults = getDefaultLists();
                if (!hasAlreadyWatched) lists.unshift(defaults[0]);
                if (!hasCustomMovies) lists.unshift(defaults[1]);
            }

            setWatchlists(lists);
            setCustomMovies(data.customMovies);
            setLoading(false);
        };

        initData();

        // Subscribe to real-time updates
        const unsubscribe = subscribeToUserData(user.uid, (data) => {
            if (data.watchlists.length > 0) setWatchlists(data.watchlists);
            setCustomMovies(data.customMovies);
        });

        return () => unsubscribe();
    }, [user]);

    // Save to Firestore whenever watchlists change
    useEffect(() => {
        if (!user || loading || watchlists.length === 0) return;
        saveWatchlists(user.uid, watchlists);
    }, [watchlists, user, loading]);

    // Save custom movies
    useEffect(() => {
        if (!user || loading) return;
        saveCustomMovies(user.uid, customMovies);
    }, [customMovies, user, loading]);

    const login = async () => {
        setLoading(true);
        await signInWithGoogle();
    };

    const logout = async () => {
        await signOut();
        setWatchlists([]);
        setCustomMovies([]);
    };

    const createWatchlist = (name: string) => {
        const newList: Watchlist = {
            id: generateUUID(),
            name,
            movieIds: [],
            createdAt: Date.now(),
        };
        setWatchlists(prev => [...prev, newList]);
    };

    const deleteWatchlist = (id: string) => {
        if (id === ALREADY_WATCHED_ID || id === CUSTOM_MOVIES_ID) return;
        setWatchlists(prev => prev.filter(list => list.id !== id));
    };

    const addCustomMovie = (movieData: Omit<Movie, 'id'>) => {
        const newMovie: Movie = {
            ...movieData,
            id: Date.now(),
            isCustom: true,
        };
        setCustomMovies(prev => [...prev, newMovie]);
        setWatchlists(prev => prev.map(list => {
            if (list.id === CUSTOM_MOVIES_ID) {
                return { ...list, movieIds: [...list.movieIds, newMovie.id] };
            }
            return list;
        }));
        return newMovie;
    };

    const addMovieToWatchlist = (watchlistId: string, movie: Movie) => {
        setWatchlists(prev => prev.map(list => {
            if (list.id !== watchlistId) return list;
            if (list.movieIds.includes(movie.id)) return list;
            return { ...list, movieIds: [...list.movieIds, movie.id] };
        }));
    };

    const removeMovieFromWatchlist = (watchlistId: string, movieId: number) => {
        setWatchlists(prev => prev.map(list => {
            if (list.id !== watchlistId) return list;
            return { ...list, movieIds: list.movieIds.filter(id => id !== movieId) };
        }));
    };

    const markAsWatched = (fromListId: string, movie: Movie) => {
        setWatchlists(prev => prev.map(list => {
            if (list.id === fromListId) {
                return { ...list, movieIds: list.movieIds.filter(id => id !== movie.id) };
            }
            if (list.id === ALREADY_WATCHED_ID) {
                if (list.movieIds.includes(movie.id)) return list;
                return { ...list, movieIds: [...list.movieIds, movie.id] };
            }
            return list;
        }));
    };

    const moveMovieToWatchlist = (fromListId: string, toListId: string, movieId: number) => {
        setWatchlists(prev => prev.map(list => {
            // Remove from source list
            if (list.id === fromListId) {
                return { ...list, movieIds: list.movieIds.filter(id => id !== movieId) };
            }
            // Add to destination list (if not already there)
            if (list.id === toListId) {
                if (list.movieIds.includes(movieId)) return list;
                return { ...list, movieIds: [...list.movieIds, movieId] };
            }
            return list;
        }));
    };

    const getMovie = (id: number) => customMovies.find(m => m.id === id);

    return (
        <AppContext.Provider value={{
            user,
            watchlists,
            customMovies,
            loading,
            login,
            logout,
            createWatchlist,
            deleteWatchlist,
            addMovieToWatchlist,
            removeMovieFromWatchlist,
            markAsWatched,
            moveMovieToWatchlist,
            addCustomMovie,
            getMovie
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
