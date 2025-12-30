import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReactNode, useRef, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider, useAppContext, ALREADY_WATCHED_ID, CUSTOM_MOVIES_ID } from '../context/AppContext';
import type { AppContextType } from '../context/AppContext';

// Mock Firebase
vi.mock('../services/firebase', () => ({
    saveWatchlists: vi.fn(),
    saveCustomMovies: vi.fn(),
    loadUserData: vi.fn().mockResolvedValue({ watchlists: [], customMovies: [] }),
    subscribeToUserData: vi.fn().mockReturnValue(() => { }),
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
    onAuthChange: vi.fn((callback) => {
        // Simulate no user logged in
        callback(null);
        return () => { };
    }),
}));

// Helper to render with providers
const renderWithProviders = (ui: ReactNode) => {
    return render(
        <BrowserRouter>
            <AppProvider>
                {ui}
            </AppProvider>
        </BrowserRouter>
    );
};

// Test component to access context
const TestComponent = () => {
    const {
        watchlists,
        customMovies,
        user,
        loading,
        createWatchlist,
        addCustomMovie,
    } = useAppContext();

    return (
        <div>
            <div data-testid="watchlists-count">{watchlists.length}</div>
            <div data-testid="custom-movies-count">{customMovies.length}</div>
            <div data-testid="watchlist-names">{watchlists.map(w => w.name).join(',')}</div>
            <div data-testid="user-status">{user ? 'logged-in' : 'logged-out'}</div>
            <div data-testid="loading-status">{loading ? 'loading' : 'ready'}</div>
            <button onClick={() => createWatchlist('Test List')}>Create List</button>
            <button onClick={() => addCustomMovie({ title: 'Custom Movie', overview: 'Test', release_date: '2024-01-01', poster_path: null, vote_average: 8 })}>
                Add Custom
            </button>
        </div>
    );
};

describe('AppContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should start with empty watchlists when no user is logged in', async () => {
        renderWithProviders(<TestComponent />);

        // When no user is logged in, watchlists should be empty
        await vi.waitFor(() => {
            expect(screen.getByTestId('loading-status').textContent).toBe('ready');
        });

        expect(screen.getByTestId('watchlists-count').textContent).toBe('0');
        expect(screen.getByTestId('user-status').textContent).toBe('logged-out');
    });

    it('should create a new watchlist', async () => {
        const user = userEvent.setup();
        renderWithProviders(<TestComponent />);

        await vi.waitFor(() => {
            expect(screen.getByTestId('loading-status').textContent).toBe('ready');
        });

        const initialCount = parseInt(screen.getByTestId('watchlists-count').textContent || '0');

        await user.click(screen.getByText('Create List'));

        await vi.waitFor(() => {
            const newCount = parseInt(screen.getByTestId('watchlists-count').textContent || '0');
            expect(newCount).toBeGreaterThan(initialCount);
        });
    });

    it('should add a custom movie', async () => {
        const user = userEvent.setup();
        renderWithProviders(<TestComponent />);

        await vi.waitFor(() => {
            expect(screen.getByTestId('loading-status').textContent).toBe('ready');
        });

        expect(screen.getByTestId('custom-movies-count').textContent).toBe('0');

        await user.click(screen.getByText('Add Custom'));

        await vi.waitFor(() => {
            expect(screen.getByTestId('custom-movies-count').textContent).toBe('1');
        });
    });
});

describe('Default List IDs', () => {
    it('should export correct IDs for default lists', () => {
        expect(ALREADY_WATCHED_ID).toBe('already-watched');
        expect(CUSTOM_MOVIES_ID).toBe('custom-movies');
    });
});

describe('moveMovieToWatchlist function', () => {
    it('should be available in context', () => {
        // Use a ref to capture the context value
        const contextRef = { current: null as AppContextType | null };

        const TestContextAccess = () => {
            const ctx = useAppContext();
            const ref = useRef(ctx);
            useEffect(() => {
                contextRef.current = ref.current;
            }, []);
            return null;
        };

        renderWithProviders(<TestContextAccess />);

        expect(contextRef.current).toHaveProperty('moveMovieToWatchlist');
        expect(typeof contextRef.current?.moveMovieToWatchlist).toBe('function');
    });
});
