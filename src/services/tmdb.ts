import type { Movie } from '../types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

interface TMDBResponse {
    results: TMDBMovie[];
    page: number;
    total_pages: number;
    total_results: number;
}

interface TMDBMovie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
}

const mapTMDBMovie = (movie: TMDBMovie): Movie => ({
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
});

export const getMovieById = async (id: number): Promise<Movie | undefined> => {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/${id}?api_key=${API_KEY}`
        );
        if (!response.ok) return undefined;
        const data: TMDBMovie = await response.json();
        return mapTMDBMovie(data);
    } catch (error) {
        console.error('Error fetching movie by ID:', error);
        return undefined;
    }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
    if (!query.trim()) return getPopularMovies();

    try {
        const response = await fetch(
            `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`
        );
        if (!response.ok) return [];
        const data: TMDBResponse = await response.json();
        return data.results.map(mapTMDBMovie);
    } catch (error) {
        console.error('Error searching movies:', error);
        return [];
    }
};

export const getPopularMovies = async (): Promise<Movie[]> => {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/popular?api_key=${API_KEY}`
        );
        if (!response.ok) return [];
        const data: TMDBResponse = await response.json();
        return data.results.map(mapTMDBMovie);
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        return [];
    }
};

// Helper to get image URL
export const getImageUrl = (path: string | null, size: 'w200' | 'w500' | 'original' = 'w200'): string | null => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Movie details with credits
export interface MovieDetails {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    runtime: number | null;
    genres: { id: number; name: string }[];
    tagline: string;
    status: string;
    budget: number;
    revenue: number;
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
    crew: { id: number; name: string; job: string; department: string }[];
}

export const getMovieDetails = async (id: number): Promise<MovieDetails | null> => {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits`
        );
        if (!response.ok) return null;
        const data = await response.json();

        interface TMDBCast {
            id: number;
            name: string;
            character: string;
            profile_path: string | null;
        }

        interface TMDBCrew {
            id: number;
            name: string;
            job: string;
            department: string;
        }

        return {
            id: data.id,
            title: data.title,
            overview: data.overview,
            poster_path: data.poster_path,
            backdrop_path: data.backdrop_path,
            release_date: data.release_date,
            vote_average: data.vote_average,
            runtime: data.runtime,
            genres: data.genres || [],
            tagline: data.tagline || '',
            status: data.status,
            budget: data.budget,
            revenue: data.revenue,
            cast: (data.credits?.cast || []).slice(0, 10).map((c: TMDBCast) => ({
                id: c.id,
                name: c.name,
                character: c.character,
                profile_path: c.profile_path,
            })),
            crew: (data.credits?.crew || []).filter((c: TMDBCrew) =>
                ['Director', 'Producer', 'Screenplay', 'Writer'].includes(c.job)
            ).slice(0, 5).map((c: TMDBCrew) => ({
                id: c.id,
                name: c.name,
                job: c.job,
                department: c.department,
            })),
        };
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
};

