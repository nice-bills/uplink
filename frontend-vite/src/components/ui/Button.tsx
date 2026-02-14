/**
 * Button - Industrial Brutalist
 * Hard corners, monospace text, neon glow on hover
 */

import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children: ReactNode;
}

const variants = {
    primary: 'bg-accent text-black border-accent hover:shadow-glow',
    secondary: 'bg-transparent text-zinc-50 border-zinc-600 hover:border-zinc-50 hover:bg-zinc-800/50',
};

const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-sm px-6 py-3',
};

export function Button({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    children,
    className = '',
    ...props
}: ButtonProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ y: -1 }}
            className={`
                inline-flex items-center justify-center gap-2
                font-mono font-medium uppercase tracking-wide
                border transition-all duration-150
                ${variants[variant]} 
                ${sizes[size]} 
                ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} 
                ${className}
            `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Loading...</span>
                </>
            ) : children}
        </motion.button>
    );
}
