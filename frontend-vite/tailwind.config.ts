import type { Config } from 'tailwindcss'

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Industrial dark palette
                zinc: {
                    950: '#09090B',
                    900: '#18181B',
                    800: '#27272A',
                    700: '#3F3F46',
                    600: '#52525B',
                    500: '#71717A',
                    400: '#A1A1AA',
                    300: '#D4D4D8',
                    200: '#E4E4E7',
                    100: '#F4F4F5',
                    50: '#FAFAFA',
                },
                // Neon coral accent
                accent: {
                    DEFAULT: '#FF4D4D',
                    dim: '#CC3D3D',
                    glow: 'rgba(255, 77, 77, 0.25)',
                },
                success: '#10B981',
                warning: '#F59E0B',
            },
            fontFamily: {
                display: ['Satoshi', 'system-ui', 'sans-serif'],
                sans: ['Geist', 'system-ui', 'sans-serif'],
                mono: ['IBM Plex Mono', 'monospace'],
            },
            boxShadow: {
                'hard': '4px 4px 0 rgba(39, 39, 42, 1)',
                'glow': '0 0 20px rgba(255, 77, 77, 0.25)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
} satisfies Config
