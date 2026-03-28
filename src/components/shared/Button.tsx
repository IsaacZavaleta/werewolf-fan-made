import type { ButtonHTMLAttributes, ReactNode, CSSProperties } from 'react';

export type ButtonVariant = 'primary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const styles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #c9a84c, #a07830)',
    color: '#0a0608',
    boxShadow: '0 4px 18px rgba(201,168,76,.25)',
    fontFamily: "'Cinzel Decorative', serif",
    fontSize: '.85rem',
    padding: '12px 30px',
    borderRadius: '4px',
    letterSpacing: '.08em',
    transition: 'all .2s',
    border: 'none',
    cursor: 'pointer',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--gold)',
    border: '1px solid rgba(201,168,76,.35)',
    fontFamily: "'Cinzel Decorative', serif",
    fontSize: '.85rem',
    padding: '12px 30px',
    borderRadius: '4px',
    letterSpacing: '.08em',
    transition: 'all .2s',
    cursor: 'pointer',
  },
  danger: {
    background: 'linear-gradient(135deg, #8b0000, #5a0000)',
    color: 'var(--moon)',
    boxShadow: '0 4px 18px rgba(139,0,0,.25)',
    fontFamily: "'Cinzel Decorative', serif",
    fontSize: '.85rem',
    padding: '12px 30px',
    borderRadius: '4px',
    letterSpacing: '.08em',
    transition: 'all .2s',
    border: 'none',
    cursor: 'pointer',
  },
};

export function Button({ variant = 'ghost', children, style, disabled, ...props }: ButtonProps) {
  const base = styles[variant];
  const disabledStyle: CSSProperties = disabled ? { opacity: 0.4, cursor: 'not-allowed' } : {};
  return (
    <button style={{ ...base, ...disabledStyle, ...style }} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
