import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    fullWidth?: boolean;
}

export const Button = ({
    children,
    variant = 'primary',
    fullWidth = false,
    className,
    style: customStyle,
    ...props
}: ButtonProps) => {
    const baseStyles: React.CSSProperties = {
        padding: '12px 20px',
        borderRadius: 'var(--radius-md)',
        fontSize: '16px',
        fontWeight: 600,
        border: 'none',
        cursor: 'pointer',
        transition: 'transform 0.1s ease, opacity 0.2s',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    };

    const variants = {
        primary: {
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(135, 91, 247, 0.3)',
        },
        secondary: {
            background: 'var(--color-bg-card)',
            color: 'var(--color-text-main)',
            border: '1px solid var(--color-border)',
            boxShadow: 'none',
        },
        ghost: {
            background: 'transparent',
            color: 'var(--color-text-muted)',
            border: 'none',
            boxShadow: 'none',
            padding: '8px',
        },
        danger: {
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            boxShadow: 'none',
        }
    };

    const computedStyle = {
        ...baseStyles,
        ...(variants[variant as keyof typeof variants] || variants.primary),
        width: fullWidth ? '100%' : 'auto',
        ...customStyle,
    };

    return (
        <button style={computedStyle} {...props} className={className}>
            {children}
        </button>
    );
};
