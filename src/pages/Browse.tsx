import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchMovies, getPopularMovies } from '../services/tmdb';
import { useAppContext } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import type { Movie } from '../types';
import { MovieCard } from '../components/Movie/MovieCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

// Quick debounce hook implementation inline or valid import. 
// I'll assume I need to create it, but for now I'll just use useEffect with timeout.
// To keep it clean, I will implement logic inside useEffect directly.

import { ListSelectionModal } from '../components/ListSelectionModal';

// ... imports

export const Browse = () => {
    const navigate = useNavigate();
    const { watchlists, addMovieToWatchlist } = useAppContext();
    const { showToast } = useToast();

    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovieForAdd, setSelectedMovieForAdd] = useState<Movie | null>(null);

    // Load popular movies on mount
    useEffect(() => {
        const loadPopularMovies = async () => {
            setLoading(true);
            try {
                const popularMovies = await getPopularMovies();
                setMovies(popularMovies);
            } catch (error) {
                console.error('Failed to load popular movies:', error);
            } finally {
                setLoading(false);
            }
        };
        loadPopularMovies();
    }, []);

    // Search movies with debounce
    useEffect(() => {
        if (!query.trim()) {
            // Reset to popular movies when query is cleared
            const loadPopularMovies = async () => {
                setLoading(true);
                try {
                    const popularMovies = await getPopularMovies();
                    setMovies(popularMovies);
                } catch (error) {
                    console.error('Failed to load popular movies:', error);
                } finally {
                    setLoading(false);
                }
            };
            loadPopularMovies();
            return;
        }

        const timeoutId = setTimeout(async () => {
            setLoading(true);
            try {
                const results = await searchMovies(query);
                setMovies(results);
            } catch (error) {
                console.error('Failed to search movies:', error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleAddClick = (movie: Movie) => {
        if (watchlists.length === 0) {
            showToast("Please create a Watchlist first in the 'My Lists' tab!", 'error');
            navigate('/lists');
            return;
        }

        if (watchlists.length === 1) {
            addMovieToWatchlist(watchlists[0].id, movie);
            showToast(`Added to ${watchlists[0].name}`, 'success');
        } else {
            // Open Modal
            setSelectedMovieForAdd(movie);
        }
    };

    const handleListSelect = (listId: string) => {
        if (selectedMovieForAdd) {
            const list = watchlists.find(l => l.id === listId);
            if (list) {
                addMovieToWatchlist(listId, selectedMovieForAdd);
                showToast(`Added to ${list.name}`, 'success');
            }
            setSelectedMovieForAdd(null);
        }
    };

    return (
        <div style={{ paddingBottom: '20px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>Discover</h2>
                <Input
                    placeholder="Search movies..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                />
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                    Loading...
                </div>
            ) : (
                <>
                    {movies.length === 0 && query && (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <p style={{ marginBottom: '16px', color: 'var(--color-text-muted)' }}>
                                No movies found for "{query}"
                            </p>
                            <Button onClick={() => navigate('/add-custom')}>
                                + Add Custom Movie
                            </Button>
                        </div>
                    )}

                    {movies.map(movie => (
                        <div key={movie.id} style={{ marginBottom: '16px' }}>
                            <MovieCard
                                movie={movie}
                                onAddToWatchlist={() => handleAddClick(movie)}
                            />
                        </div>
                    ))}

                    {!query && (
                        <div style={{ marginTop: '32px', textAlign: 'center', paddingBottom: '96px' }}>
                            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                                Can't find what you're looking for?
                            </p>
                            <Button variant="secondary" onClick={() => navigate('/add-custom')} fullWidth>
                                + Add a Custom Movie
                            </Button>
                        </div>
                    )}
                </>
            )}

            <ListSelectionModal
                isOpen={!!selectedMovieForAdd}
                onClose={() => setSelectedMovieForAdd(null)}
                onSelect={handleListSelect}
                watchlists={watchlists}
                movieTitle={selectedMovieForAdd?.title || ''}
            />
        </div>
    );
};
