export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
    isCustom?: boolean; // Flag for user-added movies
}

export interface Watchlist {
    id: string;
    name: string;
    movieIds: number[];
    createdAt: number;
}
