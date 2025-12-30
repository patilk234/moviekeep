import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input = ({ label, style, ...props }: InputProps) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            {label && <label style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{label}</label>}
            <input
                style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-card)',
                    color: 'var(--color-text-main)',
                    fontSize: '16px',
                    outline: 'none',
                    width: '100%',
                    ...style
                }}
                {...props}
            />
        </div>
    );
};
