/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: 따뜻한 브라운 (Warm Brown)
        primary: {
          50: '#fdf8f6',   // cream white
          100: '#f9ede7',  // light cream
          200: '#f3d9ce',  // peach cream
          300: '#e9bfab',  // soft peach
          400: '#d89b7a',  // warm tan
          500: '#c47a54',  // main brown
          600: '#b35c38',  // accent brown
          700: '#8f4a2c',  // dark brown
          800: '#6b3820',  // deep brown
          900: '#4a2714',  // espresso
        },
        // Accent: 따뜻한 앰버 (Warm Amber)
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Neutral: 따뜻한 그레이 (Warm Gray)
        warm: {
          50: '#faf9f7',   // off-white
          100: '#f5f3f0',  // paper
          200: '#e8e4de',  // light warm gray
          300: '#d6d0c7',  // warm gray
          400: '#b8b0a3',  // medium warm gray
          500: '#9a917f',  // warm gray 500
          600: '#7c7365',  // dark warm gray
          700: '#5e574c',  // darker
          800: '#403c34',  // very dark
          900: '#22201c',  // near black
        },
        // Success, Warning, Error
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        // 큰 타이포그래피 (히어로 섹션용)
        '7xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        '8xl': ['6rem', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        // 따뜻한 그림자 (Warm Shadows)
        'warm-sm': '0 1px 2px 0 rgba(74, 39, 20, 0.05)',
        'warm': '0 4px 12px 0 rgba(74, 39, 20, 0.08)',
        'warm-md': '0 6px 16px 0 rgba(74, 39, 20, 0.10)',
        'warm-lg': '0 12px 24px 0 rgba(74, 39, 20, 0.12)',
        'warm-xl': '0 24px 48px 0 rgba(74, 39, 20, 0.15)',
        // 책 그림자 효과
        'book': '0 10px 30px -5px rgba(74, 39, 20, 0.2), 0 4px 6px -2px rgba(74, 39, 20, 0.1)',
        'book-hover': '0 20px 40px -5px rgba(74, 39, 20, 0.25), 0 8px 10px -2px rgba(74, 39, 20, 0.15)',
        // 카드 그림자
        'card': '0 2px 8px 0 rgba(74, 39, 20, 0.06)',
        'card-hover': '0 8px 24px 0 rgba(74, 39, 20, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
      },
      backgroundImage: {
        // 따뜻한 그라데이션
        'warm-gradient': 'linear-gradient(135deg, #fdf8f6 0%, #f9ede7 100%)',
        'warm-gradient-subtle': 'linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)',
        // 시머 효과
        'shimmer': 'linear-gradient(90deg, #f5f3f0 0%, #faf9f7 50%, #f5f3f0 100%)',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
