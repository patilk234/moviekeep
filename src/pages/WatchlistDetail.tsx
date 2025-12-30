import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Trash2, Search, ArrowRightLeft } from 'lucide-react';
import { useAppContext, ALREADY_WATCHED_ID, CUSTOM_MOVIES_ID } from '../context/AppContext';
import { MovieCard } from '../components/Movie/MovieCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ConfirmModal } from '../components/ConfirmModal';
import { ListSelectionModal } from '../components/ListSelectionModal';
import { getMovieById } from '../services/tmdb';
import { useToast } from '../context/ToastContext';
import type { Movie } from '../types';

export const WatchlistDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { watchlists, removeMovieFromWatchlist, customMovies, deleteWatchlist, markAsWatched, moveMovieToWatchlist } = useAppContext();
    const { showToast } = useToast();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [movieToMove, setMovieToMove] = useState<Movie | null>(null);

    const list = watchlists.find(l => l.id === id);
    const isAlreadyWatchedList = id === ALREADY_WATCHED_ID;
    const isDefaultList = id === ALREADY_WATCHED_ID || id === CUSTOM_MOVIES_ID;

    // Create a stable key for movieIds to ensure effect re-runs when content changes
    const movieIdsKey = list?.movieIds.join(',') || '';

    useEffect(() => {
        if (!list) return;

        const loadMovies = async () => {
            setLoading(true);
            const loadedMovies: Movie[] = [];
            for (const movieId of list.movieIds) {
                // Check custom movies first (IDs > 1e12 are likely Date.now() generated)
                const isLikelyCustomId = movieId > 1e12;
                const custom = customMovies.find(m => m.id === movieId);

                if (custom) {
                    loadedMovies.push(custom);
                } else if (!isLikelyCustomId) {
                    // Only call TMDB API for regular movie IDs
                    const apiMovie = await getMovieById(movieId);
                    if (apiMovie) loadedMovies.push(apiMovie);
                }
                // If it's a custom ID but not found in customMovies, skip it
                // This can happen during initial load when customMovies hasn't synced yet
            }
            setMovies(loadedMovies);
            setLoading(false);
        };

        loadMovies();
    }, [movieIdsKey, customMovies, list]);

    // Filter movies based on search query
    const filteredMovies = useMemo(() => {
        if (!searchQuery.trim()) return movies;
        const query = searchQuery.toLowerCase();
        return movies.filter(m =>
            m.title.toLowerCase().includes(query) ||
            m.overview?.toLowerCase().includes(query)
        );
    }, [movies, searchQuery]);

    // Get other watchlists for move modal (exclude current list)
    const otherWatchlists = useMemo(() =>
        watchlists.filter(l => l.id !== id),
        [watchlists, id]
    );

    if (!list) {
        return <div style={{ padding: '20px' }}>List not found</div>;
    }

    const handleDeleteList = () => {
        deleteWatchlist(list.id);
        navigate('/lists');
        showToast('Watchlist deleted', 'info');
    };

    const handleMarkAsWatched = (movie: Movie) => {
        markAsWatched(list.id, movie);
        showToast(`Moved "${movie.title}" to Already Watched`, 'success');
    };

    const handleRemove = (movie: Movie) => {
        removeMovieFromWatchlist(list.id, movie.id);
        showToast(`Removed "${movie.title}"`, 'info');
    };

    const handleMoveToList = (toListId: string) => {
        if (!movieToMove) return;
        const destList = watchlists.find(l => l.id === toListId);
        moveMovieToWatchlist(list.id, toListId, movieToMove.id);
        showToast(`Moved "${movieToMove.title}" to ${destList?.name}`, 'success');
        setMovieToMove(null);
    };

    // Render extra action buttons for watchlist items
    const renderExtraActions = (movie: Movie) => (
        <>
            {/* Move to other watchlist button */}
            <button
                onClick={(e) => { e.stopPropagation(); setMovieToMove(movie); }}
                title="Move to another list"
                style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    borderRadius: 'var(--radius-md)',
                    padding: '6px',
                    cursor: 'pointer',
                    color: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <ArrowRightLeft size={14} />
            </button>
            {!isAlreadyWatchedList && (
                <button
                    onClick={(e) => { e.stopPropagation(); handleMarkAsWatched(movie); }}
                    title="Mark as watched"
                    style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        borderRadius: 'var(--radius-md)',
                        padding: '6px',
                        cursor: 'pointer',
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <CheckCircle size={14} />
                </button>
            )}
            <button
                onClick={(e) => { e.stopPropagation(); handleRemove(movie); }}
                title="Remove from list"
                style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: 'var(--radius-md)',
                    padding: '6px',
                    cursor: 'pointer',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Trash2 size={14} />
            </button>
        </>
    );

    return (
        <div style={{ paddingBottom: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Button variant="ghost" onClick={() => navigate('/lists')}>
                        <span style={{ fontSize: '20px', lineHeight: 1 }}>←</span>
                    </Button>
                    <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{list.name}</h2>
                </div>
                {!isDefaultList && (
                    <Button variant="danger" onClick={() => setShowDeleteConfirm(true)} style={{ fontSize: '14px', padding: '8px 16px' }}>
                        Delete
                    </Button>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Delete Watchlist"
                message={`Are you sure you want to delete "${list.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                onConfirm={handleDeleteList}
                onCancel={() => setShowDeleteConfirm(false)}
            />

            {/* Move to Watchlist Modal */}
            <ListSelectionModal
                isOpen={movieToMove !== null}
                onClose={() => setMovieToMove(null)}
                onSelect={handleMoveToList}
                watchlists={otherWatchlists}
                movieTitle={movieToMove?.title || ''}
                title="Move to Watchlist"
                description={`Select destination for "${movieToMove?.title}":`}
            />

            {/* Search Bar */}
            {movies.length > 0 && (
                <div style={{ marginBottom: '16px', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
                        <Search size={18} />
                    </div>
                    <Input
                        placeholder="Search in this list..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{ paddingLeft: '40px' }}
                    />
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>
                    Loading...
                </div>
            ) : filteredMovies.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>
                    {searchQuery ? (
                        <p>No movies match "{searchQuery}"</p>
                    ) : (
                        <>
                            <p>No movies in this list.</p>
                            <Button onClick={() => navigate('/')} variant="primary" style={{ marginTop: '16px' }}>
                                Browse Movies
                            </Button>
                        </>
                    )}
                </div>
            ) : (
                filteredMovies.map(movie => (
                    <MovieCard
                        key={movie.id}
                        movie={movie}
                        onAddToWatchlist={() => { }}
                        isInWatchlist={true}
                        extraActions={renderExtraActions(movie)}
                    />
                ))
            )}
        </div>
    );
};
