import { useRef, useEffect } from 'react';
import type { Watchlist } from '../types';
import { X } from 'lucide-react';

interface ListSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (listId: string) => void;
    watchlists: Watchlist[];
    movieTitle: string;
    title?: string;
    description?: string;
}

export const ListSelectionModal = ({
    isOpen,
    onClose,
    onSelect,
    watchlists,
    movieTitle,
    title = 'Add to List',
    description
}: ListSelectionModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease-out',
        }}>
            <div
                ref={modalRef}
                style={{
                    backgroundColor: 'var(--color-bg-card)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px',
                    width: '90%',
                    maxWidth: '400px',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    animation: 'scaleIn 0.2s ease-out',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                            padding: '4px',
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px', fontSize: '14px' }}>
                    {description || <>Select a watchlist for <strong>{movieTitle}</strong>:</>}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {watchlists.map(list => (
                        <button
                            key={list.id}
                            onClick={() => onSelect(list.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '16px',
                                background: 'var(--color-bg-main)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-text-main)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                textAlign: 'left',
                                fontSize: '16px',
                                fontWeight: 500,
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = 'var(--color-primary)';
                                e.currentTarget.style.transform = 'translateX(4px)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = 'var(--color-border)';
                                e.currentTarget.style.transform = 'translateX(0)';
                            }}
                        >
                            {list.name}
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                {list.movieIds.length} movies
                            </span>
                        </button>
                    ))}
                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};
