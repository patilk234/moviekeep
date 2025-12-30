import { useLocation, useNavigate } from 'react-router-dom';
import { Search, List, LogOut } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAppContext();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '80px', paddingTop: 'env(safe-area-inset-top)' }}>
            {/* Header */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                background: 'rgba(15, 16, 20, 0.85)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--color-border)',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <h1 style={{ fontSize: '20px', fontWeight: 700 }} className="text-gradient">
                    MovieKeep
                </h1>
                {user && (
                    <button
                        onClick={logout}
                        title={`Logout (${user.email})`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'none',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            color: 'var(--color-text-muted)',
                            fontSize: '12px',
                        }}
                    >
                        {user.photoURL && (
                            <img
                                src={user.photoURL}
                                alt=""
                                style={{ width: '20px', height: '20px', borderRadius: '50%' }}
                            />
                        )}
                        <LogOut size={16} />
                    </button>
                )}
            </header>

            {/* Main Content */}
            <main className="container">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(28, 28, 33, 0.95)',
                backdropFilter: 'blur(12px)',
                borderTop: '1px solid var(--color-border)',
                padding: '12px 16px',
                paddingBottom: 'calc(12px + var(--safe-area-bottom))',
                display: 'flex',
                justifyContent: 'space-around',
                zIndex: 50
            }}>
                <NavItem
                    active={isActive('/')}
                    onClick={() => navigate('/')}
                    icon={<Search size={24} />}
                    label="Browse"
                />
                <NavItem
                    active={isActive('/lists')}
                    onClick={() => navigate('/lists')}
                    icon={<List size={24} />}
                    label="My Lists"
                />
            </nav>
        </div>
    );
};

interface NavItemProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}

const NavItem = ({ active, onClick, icon, label }: NavItemProps) => (
    <button
        onClick={onClick}
        style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
            cursor: 'pointer'
        }}
    >
        {icon}
        <span style={{ fontSize: '10px', fontWeight: 500 }}>{label}</span>
    </button>
);
