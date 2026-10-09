// components/ui/Button.tsx
'use client';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
    children: ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    fullWidth?: boolean;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-primary btn-danger',
    ghost: 'bg-transparent text-purple-600 hover:bg-purple-50 font-bold rounded-full px-4 py-2 transition cursor-pointer',
};
const sizes = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-6 py-3',
    lg: 'text-lg px-8 py-4',
};

export default function Button({ children, onClick, variant = 'primary', size = 'md', disabled, fullWidth, className = '', type = 'button' }: Props) {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            whileTap={disabled ? {} : { scale: 0.96 }}
            className={`
                ${variants[variant]}
                ${sizes[size]}
                ${fullWidth ? 'w-full justify-center' : ''}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${className}
            `}
        >
            {children}
        </motion.button>
    );
}
