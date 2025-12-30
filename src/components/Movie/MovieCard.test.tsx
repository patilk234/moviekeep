import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { MovieCard } from './MovieCard';
import type { Movie } from '../../types';

// Mock the MovieInfoModal to avoid complex setup
vi.mock('./MovieInfoModal', () => ({
    MovieInfoModal: () => null,
}));

const mockMovie: Movie = {
    id: 1,
    title: 'Test Movie',
    overview: 'A test movie description',
    poster_path: '/test.jpg',
    release_date: '2024-05-15',
    vote_average: 8.5,
};

const renderWithRouter = (ui: React.ReactNode) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('MovieCard Component', () => {
    it('should render movie title', () => {
        renderWithRouter(
            <MovieCard movie={mockMovie} onAddToWatchlist={() => { }} />
        );
        expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });

    it('should render release year', () => {
        renderWithRouter(
            <MovieCard movie={mockMovie} onAddToWatchlist={() => { }} />
        );
        expect(screen.getByText(/2024/)).toBeInTheDocument();
    });

    it('should render rating', () => {
        renderWithRouter(
            <MovieCard movie={mockMovie} onAddToWatchlist={() => { }} />
        );
        expect(screen.getByText(/8.5/)).toBeInTheDocument();
    });

    it('should render "Add" button when not in watchlist', () => {
        renderWithRouter(
            <MovieCard movie={mockMovie} onAddToWatchlist={() => { }} />
        );
        expect(screen.getByText('+ Add')).toBeInTheDocument();
    });

    it('should render "Added" when in watchlist', () => {
        renderWithRouter(
            <MovieCard movie={mockMovie} onAddToWatchlist={() => { }} isInWatchlist={true} />
        );
        expect(screen.getByText('✓ Added')).toBeInTheDocument();
    });

    it('should call onAddToWatchlist when button is clicked', async () => {
        const handleAdd = vi.fn();
        const user = userEvent.setup();

        renderWithRouter(
            <MovieCard movie={mockMovie} onAddToWatchlist={handleAdd} />
        );

        await user.click(screen.getByText('+ Add'));
        expect(handleAdd).toHaveBeenCalledTimes(1);
    });

    it('should render movie poster when poster_path exists', () => {
        renderWithRouter(
            <MovieCard movie={mockMovie} onAddToWatchlist={() => { }} />
        );
        const img = screen.getByAltText('Test Movie');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', expect.stringContaining('image.tmdb.org'));
    });

    it('should render fallback emoji when no poster', () => {
        const movieWithoutPoster = { ...mockMovie, poster_path: null };
        renderWithRouter(
            <MovieCard movie={movieWithoutPoster} onAddToWatchlist={() => { }} />
        );
        expect(screen.getByText('🎬')).toBeInTheDocument();
    });

    it('should handle movie with no release date', () => {
        const movieNoDate = { ...mockMovie, release_date: '' };
        renderWithRouter(
            <MovieCard movie={movieNoDate} onAddToWatchlist={() => { }} />
        );
        expect(screen.getByText(/Unknown/)).toBeInTheDocument();
    });

    it('should render info button', () => {
        renderWithRouter(
            <MovieCard movie={mockMovie} onAddToWatchlist={() => { }} />
        );
        expect(screen.getByTitle('View movie info')).toBeInTheDocument();
    });
});
