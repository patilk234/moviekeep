import { Button } from './ui/Button';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'primary';
}

export const ConfirmModal = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'danger'
}: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                padding: '20px',
                animation: 'fadeIn 0.2s ease-out',
            }}
            onClick={onCancel}
        >
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
            <div
                style={{
                    background: 'var(--color-bg-card)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                    padding: '24px',
                    maxWidth: '320px',
                    width: '100%',
                    animation: 'slideUp 0.2s ease-out',
                }}
                onClick={e => e.stopPropagation()}
            >
                <h3 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    marginBottom: '8px',
                    color: 'var(--color-text-main)',
                }}>
                    {title}
                </h3>
                <p style={{
                    fontSize: '14px',
                    color: 'var(--color-text-muted)',
                    marginBottom: '24px',
                    lineHeight: 1.5,
                }}>
                    {message}
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button
                        variant="ghost"
                        onClick={onCancel}
                        fullWidth
                        style={{ padding: '12px' }}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={onConfirm}
                        fullWidth
                        style={{ padding: '12px' }}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};
