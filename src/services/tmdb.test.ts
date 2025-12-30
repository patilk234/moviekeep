import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchMovies, getPopularMovies, getMovieById, getMovieDetails, getImageUrl } from '../services/tmdb';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockMovie = {
    id: 1,
    title: 'Test Movie',
    overview: 'A test movie description',
    poster_path: '/test.jpg',
    release_date: '2024-01-01',
    vote_average: 8.5,
};

const mockMovieDetails = {
    ...mockMovie,
    backdrop_path: '/backdrop.jpg',
    runtime: 120,
    genres: [{ id: 1, name: 'Action' }],
    tagline: 'Test tagline',
    status: 'Released',
    budget: 100000000,
    revenue: 500000000,
    credits: {
        cast: [{ id: 1, name: 'Actor 1', character: 'Hero', profile_path: '/actor.jpg' }],
        crew: [{ id: 2, name: 'Director', job: 'Director', department: 'Directing' }],
    },
};

describe('TMDB Service', () => {
    beforeEach(() => {
        mockFetch.mockReset();
    });

    describe('getPopularMovies', () => {
        it('should fetch popular movies successfully', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ results: [mockMovie] }),
            });

            const movies = await getPopularMovies();

            expect(movies).toHaveLength(1);
            expect(movies[0].title).toBe('Test Movie');
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        it('should return empty array on fetch error', async () => {
            mockFetch.mockResolvedValueOnce({ ok: false });

            const movies = await getPopularMovies();

            expect(movies).toEqual([]);
        });

        it('should return empty array on network error', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            const movies = await getPopularMovies();

            expect(movies).toEqual([]);
        });
    });

    describe('searchMovies', () => {
        it('should search movies by query', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ results: [mockMovie] }),
            });

            const movies = await searchMovies('test');

            expect(movies).toHaveLength(1);
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('search/movie'));
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('query=test'));
        });

        it('should call getPopularMovies when query is empty', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ results: [mockMovie] }),
            });

            await searchMovies('');

            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('movie/popular'));
        });
    });

    describe('getMovieById', () => {
        it('should fetch a movie by ID', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockMovie,
            });

            const movie = await getMovieById(1);

            expect(movie?.title).toBe('Test Movie');
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('movie/1'));
        });

        it('should return undefined for non-existent movie', async () => {
            mockFetch.mockResolvedValueOnce({ ok: false });

            const movie = await getMovieById(999);

            expect(movie).toBeUndefined();
        });
    });

    describe('getMovieDetails', () => {
        it('should fetch movie details with credits', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockMovieDetails,
            });

            const details = await getMovieDetails(1);

            expect(details?.title).toBe('Test Movie');
            expect(details?.runtime).toBe(120);
            expect(details?.genres).toHaveLength(1);
            expect(details?.cast).toHaveLength(1);
            expect(details?.crew).toHaveLength(1);
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('append_to_response=credits'));
        });

        it('should return null on error', async () => {
            mockFetch.mockResolvedValueOnce({ ok: false });

            const details = await getMovieDetails(999);

            expect(details).toBeNull();
        });
    });

    describe('getImageUrl', () => {
        it('should return correct image URL for default size', () => {
            const url = getImageUrl('/test.jpg');
            expect(url).toBe('https://image.tmdb.org/t/p/w200/test.jpg');
        });

        it('should return correct image URL for w500 size', () => {
            const url = getImageUrl('/test.jpg', 'w500');
            expect(url).toBe('https://image.tmdb.org/t/p/w500/test.jpg');
        });

        it('should return null for null path', () => {
            const url = getImageUrl(null);
            expect(url).toBeNull();
        });
    });
});
