import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Film } from 'lucide-react';
import { useAppContext, ALREADY_WATCHED_ID, CUSTOM_MOVIES_ID } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const MyLists = () => {
    const { watchlists, createWatchlist } = useAppContext();
    const navigate = useNavigate();
    const [isCreating, setIsCreating] = useState(false);
    const [newListName, setNewListName] = useState('');

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newListName.trim()) return;
        createWatchlist(newListName);
        setNewListName('');
        setIsCreating(false);
    };

    // Sort lists: Already Watched first, Custom Movies second, then by creation date
    const sortedLists = [...watchlists].sort((a, b) => {
        if (a.id === ALREADY_WATCHED_ID) return -1;
        if (b.id === ALREADY_WATCHED_ID) return 1;
        if (a.id === CUSTOM_MOVIES_ID) return -1;
        if (b.id === CUSTOM_MOVIES_ID) return 1;
        return b.createdAt - a.createdAt;
    });

    const getListStyle = (listId: string) => {
        if (listId === ALREADY_WATCHED_ID) {
            return {
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                hoverBorder: 'rgba(16, 185, 129, 0.6)',
                color: '#10b981',
            };
        }
        if (listId === CUSTOM_MOVIES_ID) {
            return {
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                hoverBorder: 'rgba(139, 92, 246, 0.6)',
                color: '#8b5cf6',
            };
        }
        return {
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            hoverBorder: 'var(--color-primary)',
            color: 'var(--color-text-main)',
        };
    };

    return (
        <div style={{ paddingBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700 }}>My Watchlists</h2>
                <Button variant="secondary" onClick={() => setIsCreating(true)} style={{ width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '24px', lineHeight: 1 }}>+</span>
                </Button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreate} style={{ marginBottom: '24px', background: 'var(--color-bg-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <Input
                        placeholder="List Name (e.g., Weekend Binge)"
                        value={newListName}
                        onChange={e => setNewListName(e.target.value)}
                        autoFocus
                        style={{ marginBottom: '16px' }}
                    />
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Button type="submit" fullWidth>Create</Button>
                        <Button type="button" variant="ghost" onClick={() => setIsCreating(false)} fullWidth>Cancel</Button>
                    </div>
                </form>
            )}

            {sortedLists.length === 0 && !isCreating ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>
                    <p style={{ marginBottom: '16px' }}>You haven't created any lists yet.</p>
                    <Button onClick={() => setIsCreating(true)}>Create New List</Button>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                    {sortedLists.map(list => {
                        const style = getListStyle(list.id);
                        const isAlreadyWatched = list.id === ALREADY_WATCHED_ID;
                        const isCustomMovies = list.id === CUSTOM_MOVIES_ID;

                        return (
                            <div
                                key={list.id}
                                onClick={() => navigate(`/lists/${list.id}`)}
                                style={{
                                    background: style.background,
                                    padding: '16px',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    border: style.border,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = style.hoverBorder;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = style.border.replace('1px solid ', '');
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {isAlreadyWatched && <CheckCircle size={20} color="#10b981" />}
                                    {isCustomMovies && <Film size={20} color="#8b5cf6" />}
                                    <div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: style.color }}>
                                            {list.name}
                                        </h3>
                                        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                            {list.movieIds.length} movies
                                        </p>
                                    </div>
                                </div>
                                <div style={{ color: 'var(--color-text-muted)' }}>→</div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
