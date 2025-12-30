import { useEffect, useState, useRef, useCallback } from 'react';
import { X, Clock, Calendar, Star, DollarSign } from 'lucide-react';
import { getMovieDetails, getImageUrl, type MovieDetails } from '../../services/tmdb';

interface MovieInfoModalProps {
    movieId: number | null;
    onClose: () => void;
}

export const MovieInfoModal = ({ movieId, onClose }: MovieInfoModalProps) => {
    const [details, setDetails] = useState<MovieDetails | null>(null);
    const [fetchingFor, setFetchingFor] = useState<number | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Derived loading state - loading when we're fetching for current movieId
    const loading = movieId !== null && (fetchingFor === movieId || details === null);

    const fetchData = useCallback(async (id: number) => {
        setFetchingFor(id);
        const data = await getMovieDetails(id);
        setDetails(data);
        setFetchingFor(null);
    }, []);

    useEffect(() => {
        if (!movieId) return;

        // Only fetch if we don't have details for this movie
        if (details?.id !== movieId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- setState is in async callback, not synchronous
            fetchData(movieId);
        }
    }, [movieId, details?.id, fetchData]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        if (movieId) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [movieId, onClose]);

    if (!movieId) return null;

    const formatMoney = (amount: number) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    const formatRuntime = (minutes: number | null) => {
        if (!minutes) return 'N/A';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            animation: 'fadeIn 0.2s ease-out',
        }}>
            <div
                ref={modalRef}
                style={{
                    backgroundColor: 'var(--color-bg-main)',
                    borderRadius: '20px 20px 0 0',
                    width: '100%',
                    maxWidth: '500px',
                    maxHeight: '85vh',
                    overflow: 'auto',
                    animation: 'slideUp 0.3s ease-out',
                }}
            >
                {loading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        Loading...
                    </div>
                ) : details ? (
                    <>
                        {/* Header with backdrop */}
                        <div style={{ position: 'relative' }}>
                            {details.backdrop_path && (
                                <img
                                    src={getImageUrl(details.backdrop_path, 'w500')!}
                                    alt=""
                                    style={{
                                        width: '100%',
                                        height: '180px',
                                        objectFit: 'cover',
                                        opacity: 0.6,
                                    }}
                                />
                            )}
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to top, var(--color-bg-main) 0%, transparent 100%)',
                            }} />
                            <button
                                onClick={onClose}
                                style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    background: 'rgba(0,0,0,0.5)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    padding: '8px',
                                    cursor: 'pointer',
                                    color: 'white',
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '0 20px 24px' }}>
                            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>
                                {details.title}
                            </h2>
                            {details.tagline && (
                                <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', marginBottom: '12px', fontSize: '14px' }}>
                                    "{details.tagline}"
                                </p>
                            )}

                            {/* Quick Stats */}
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                                    <Star size={14} color="#fbbf24" /> {details.vote_average.toFixed(1)}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                                    <Clock size={14} /> {formatRuntime(details.runtime)}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                                    <Calendar size={14} /> {details.release_date?.split('-')[0] || 'N/A'}
                                </span>
                            </div>

                            {/* Genres */}
                            {details.genres.length > 0 && (
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                    {details.genres.map(g => (
                                        <span key={g.id} style={{
                                            background: 'var(--color-bg-card)',
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            border: '1px solid var(--color-border)',
                                        }}>
                                            {g.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Overview */}
                            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                                {details.overview || 'No overview available.'}
                            </p>

                            {/* Budget & Revenue */}
                            {(details.budget > 0 || details.revenue > 0) && (
                                <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
                                    {details.budget > 0 && (
                                        <div>
                                            <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Budget</p>
                                            <p style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <DollarSign size={14} /> {formatMoney(details.budget)}
                                            </p>
                                        </div>
                                    )}
                                    {details.revenue > 0 && (
                                        <div>
                                            <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Revenue</p>
                                            <p style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <DollarSign size={14} /> {formatMoney(details.revenue)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Crew */}
                            {details.crew.length > 0 && (
                                <div style={{ marginBottom: '20px' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>Crew</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                        {details.crew.map((c, i) => (
                                            <div key={`${c.id}-${i}`} style={{ minWidth: '120px' }}>
                                                <p style={{ fontSize: '13px', fontWeight: 500 }}>{c.name}</p>
                                                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{c.job}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Cast */}
                            {details.cast.length > 0 && (
                                <div>
                                    <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>Cast</h3>
                                    <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                                        {details.cast.map(c => (
                                            <div key={c.id} style={{ textAlign: 'center', flexShrink: 0, width: '70px' }}>
                                                <div style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    borderRadius: '50%',
                                                    overflow: 'hidden',
                                                    margin: '0 auto 6px',
                                                    background: 'var(--color-bg-card)',
                                                }}>
                                                    {c.profile_path ? (
                                                        <img
                                                            src={getImageUrl(c.profile_path, 'w200')!}
                                                            alt={c.name}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                                                            👤
                                                        </div>
                                                    )}
                                                </div>
                                                <p style={{ fontSize: '11px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {c.name}
                                                </p>
                                                <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {c.character}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        Failed to load movie details
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
            `}</style>
        </div>
    );
};
