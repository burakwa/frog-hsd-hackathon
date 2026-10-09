// components/ui/Card.tsx
'use client';
import type { ReactNode } from 'react';

interface Props {
    children: ReactNode;
    glass?: boolean;
    className?: string;
    padding?: string;
}

export default function Card({ children, glass = false, className = '', padding = 'p-6' }: Props) {
    return (
        <div className={`${glass ? 'card-glass' : 'card'} ${padding} ${className}`}>
            {children}
        </div>
    );
}
