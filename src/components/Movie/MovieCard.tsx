import { useState } from 'react';
import { Info } from 'lucide-react';
import type { Movie } from '../../types';
import type { ReactNode } from 'react';
import { Button } from '../ui/Button';
import { MovieInfoModal } from './MovieInfoModal';

interface MovieCardProps {
    movie: Movie;
    onAddToWatchlist: () => void;
    isInWatchlist?: boolean;
    extraActions?: ReactNode;
}

export const MovieCard = ({ movie, onAddToWatchlist, isInWatchlist, extraActions }: MovieCardProps) => {
    const [imgError, setImgError] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    return (
        <>
            <div style={{
                display: 'flex',
                background: 'var(--color-bg-card)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                marginBottom: '16px',
                border: '1px solid var(--color-border)',
                minHeight: '140px'
            }}>
                {/* Poster / Fallback */}
                <div style={{
                    width: '100px',
                    backgroundColor: '#2d2d35',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-muted)',
                    fontSize: '24px'
                }}>
                    {movie.poster_path && !imgError ? (
                        <img
                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                            alt={movie.title}
                            onError={() => setImgError(true)}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <span>🎬</span>
                    )}
                </div>

                {/* Content */}
                <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <h3 style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        marginBottom: '4px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.3,
                    }}>
                        {movie.title}
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                        {movie.release_date?.split('-')[0] || 'Unknown'} • ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
                    </p>

                    <div style={{ marginTop: 'auto', display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Button
                            variant="secondary"
                            style={{ fontSize: '11px', padding: '6px 10px' }}
                            onClick={onAddToWatchlist}
                        >
                            {isInWatchlist ? '✓ Added' : '+ Add'}
                        </Button>
                        <button
                            onClick={() => setShowInfo(true)}
                            style={{
                                background: 'var(--color-bg-main)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                padding: '6px',
                                cursor: 'pointer',
                                color: 'var(--color-text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            title="View movie info"
                        >
                            <Info size={14} />
                        </button>
                        {/* Extra action buttons passed from parent */}
                        {extraActions}
                    </div>
                </div>
            </div>

            <MovieInfoModal
                movieId={showInfo ? movie.id : null}
                onClose={() => setShowInfo(false)}
            />
        </>
    );
};
