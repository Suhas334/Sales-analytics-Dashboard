/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3B82F6', // Blue 500 - Brand Color
                secondary: '#10B981', // Emerald 500 - Success/Action
                slate: {
                    50: '#F8FAFC',
                    100: '#F1F5F9', // Backgrounds
                    200: '#E2E8F0', // Borders
                    300: '#CBD5E1',
                    400: '#94A3B8', // Muted Text
                    500: '#64748B', // Secondary Text
                    600: '#475569',
                    700: '#334155',
                    800: '#1E293B', // Headings
                    900: '#0F172A', // Main Text
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
