/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Apple-style monochrome palette
        primary: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#1d1d1f',  // Apple's primary dark
          700: '#161617',
          800: '#0f0f10',
          900: '#000000',
        },
      },
      fontSize: {
        // Apple-style larger typography
        '7xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        '8xl': ['6rem', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
      },
      spacing: {
        // Apple-style generous spacing
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
      },
      boxShadow: {
        // Apple-style subtle shadows
        'apple-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        'apple': '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
        'apple-lg': '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
