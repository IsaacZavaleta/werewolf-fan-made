import type { CSSProperties, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  style?: CSSProperties;
}

export function Card({ children, style }: Props) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(26,15,15,.85) 0%, rgba(10,6,8,.9) 100%)',
      border: '1px solid rgba(201,168,76,0.2)',
      borderRadius: '4px',
      padding: '28px 32px',
      marginBottom: '24px',
      backdropFilter: 'blur(6px)',
      boxShadow: '0 4px 40px rgba(0,0,0,.6), inset 0 1px 0 rgba(201,168,76,0.08)',
      ...style,
    }}>
      {children}
    </div>
  );
}
