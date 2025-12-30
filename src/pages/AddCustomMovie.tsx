import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const AddCustomMovie = () => {
    const navigate = useNavigate();
    const { addCustomMovie } = useAppContext();

    const [title, setTitle] = useState('');
    const [overview, setOverview] = useState('');
    const [year, setYear] = useState(new Date().getFullYear().toString());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        addCustomMovie({
            title,
            overview,
            release_date: `${year}-01-01`,
            poster_path: null,
            vote_average: 0
        });

        navigate('/');
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '12px' }}>
                <Button variant="ghost" onClick={() => navigate(-1)}>
                    <span style={{ fontSize: '20px', lineHeight: 1 }}>←</span>
                </Button>
                <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Add Custom Movie</h2>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Input
                    label="Movie Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Enter title"
                    required
                />

                <Input
                    label="Release Year"
                    type="number"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    placeholder="YYYY"
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Description</label>
                    <textarea
                        value={overview}
                        onChange={e => setOverview(e.target.value)}
                        style={{
                            padding: '12px 16px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)',
                            background: 'var(--color-bg-card)',
                            color: 'var(--color-text-main)',
                            fontSize: '16px',
                            outline: 'none',
                            minHeight: '100px',
                            fontFamily: 'inherit'
                        }}
                        placeholder="Brief plot summary..."
                    />
                </div>

                <Button type="submit" fullWidth style={{ marginTop: '12px' }}>
                    Save Movie
                </Button>
            </form>
        </div>
    );
};
