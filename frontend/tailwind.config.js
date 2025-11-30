/** @type {import('tailwindcss').Config} */

/**
 * 🎨 AUI Hearts & Minds - Tailwind Configuration
 * Using Al Akhawayn University's Official Color Palette
 * 
 * Design Philosophy:
 * - Calm campus atmosphere inspired by AUI's natural setting
 * - Deep green + teal + mint harmony from AUI brand
 * - Gold accents for warmth and achievement
 * - Organic shapes & soft shadows
 * - Warm, human, campus-friendly mental health design
 */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Using CSS Variables
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: '#AED7CB',
          300: '#85C3B1',
          400: '#5DAF97',
          500: '#348B7D',
          600: 'var(--color-primary-light)',
          700: 'var(--color-primary)',
          800: 'var(--color-primary-dark)',
          900: '#002518',
        },
        
        // Accent Colors
        accent: {
          DEFAULT: 'var(--color-accent)',
          light: 'var(--color-accent-light)',
          warm: 'var(--color-accent-warm)',
          success: 'var(--color-accent-success)',
          warning: 'var(--color-accent-warning)',
          error: 'var(--color-accent-error)',
        },
        
        // Foreground (Text) Colors
        fg: {
          DEFAULT: 'var(--color-fg)',
          secondary: 'var(--color-fg-secondary)',
          muted: 'var(--color-fg-muted)',
          disabled: 'var(--color-fg-disabled)',
          inverse: 'var(--color-fg-inverse)',
        },
        
        // Background Colors
        bg: {
          DEFAULT: 'var(--color-bg)',
          white: 'var(--color-bg-white)',
          subtle: 'var(--color-bg-subtle)',
          card: 'var(--color-bg-card)',
          hover: 'var(--color-bg-hover)',
        },
        
        // Border Colors
        border: {
          DEFAULT: 'var(--color-border)',
          light: 'var(--color-border-light)',
          strong: 'var(--color-border-strong)',
        },
        
        // Legacy mappings for backward compatibility
        background: {
          mint: 'var(--color-bg)',
          white: 'var(--color-bg-white)',
          subtle: 'var(--color-bg-subtle)',
          card: 'var(--color-bg-card)',
          cream: '#F9FAFB',
        },
        
        secondary: {
          teal: 'var(--color-accent)',
          blue: '#0891B2',
          gold: 'var(--color-accent-warm)',
          sage: '#85C3B1',
        },
        
        text: {
          primary: 'var(--color-fg)',
          secondary: 'var(--color-fg-secondary)',
          muted: 'var(--color-fg-muted)',
          disabled: 'var(--color-fg-disabled)',
          inverse: 'var(--color-fg-inverse)',
        },
      },
      
      // Background Gradients - Calming AUI Theme
      backgroundImage: {
        'mint-wave': 'linear-gradient(135deg, #EBF5F2 0%, #D6EBE5 100%)',
        'green-soft': 'linear-gradient(135deg, #F0F9F6 0%, #EBF5F2 100%)',
        'hero-glow': 'linear-gradient(180deg, #FFFFFF 0%, #F0F9F6 50%, #EBF5F2 100%)',
        'aui-gradient': 'linear-gradient(135deg, #004B36 0%, #007B8A 100%)',
        'teal-soft': 'linear-gradient(135deg, rgba(0, 123, 138, 0.08) 0%, rgba(0, 123, 138, 0.02) 100%)',
        'gold-soft': 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.02) 100%)',
        'calm-overlay': 'linear-gradient(135deg, rgba(235, 245, 242, 0.9) 0%, rgba(214, 235, 229, 0.9) 100%)',
      },
      
      // Border Radius (Organic, Friendly Shapes)
      borderRadius: {
        'sm': '0.375rem',       // 6px
        'DEFAULT': '0.75rem',   // 12px
        'md': '1rem',           // 16px
        'lg': '1.5rem',         // 24px
        'xl': '1.75rem',        // 28px
        '2xl': '2rem',          // 32px
        'pill': '9999px',       // Full pill
      },
      
      // Soft Green Shadows
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 75, 54, 0.05)',
        'DEFAULT': '0 2px 8px 0 rgba(0, 75, 54, 0.08)',
        'md': '0 4px 16px 0 rgba(0, 75, 54, 0.10)',
        'lg': '0 8px 24px 0 rgba(0, 75, 54, 0.12)',
        'xl': '0 12px 32px 0 rgba(0, 75, 54, 0.15)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 75, 54, 0.06)',
        'none': '0 0 #0000',
      },
      
      // Typography
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      
      fontSize: {
        'xs': '0.75rem',        // 12px
        'sm': '0.875rem',       // 14px
        'base': '1rem',         // 16px
        'lg': '1.125rem',       // 18px
        'xl': '1.25rem',        // 20px
        '2xl': '1.5rem',        // 24px
        '3xl': '1.875rem',      // 30px
        '4xl': '2.25rem',       // 36px
        '5xl': '3rem',          // 48px
      },
      
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      
      lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75',
        loose: '2',
      },
      
      // Spacing Scale (8px base)
      spacing: {
        '0': '0',
        '1': '0.25rem',        // 4px
        '2': '0.5rem',         // 8px
        '3': '0.75rem',        // 12px
        '4': '1rem',           // 16px
        '5': '1.25rem',        // 20px
        '6': '1.5rem',         // 24px
        '8': '2rem',           // 32px
        '10': '2.5rem',        // 40px
        '12': '3rem',          // 48px
        '16': '4rem',          // 64px
        '20': '5rem',          // 80px
        '24': '6rem',          // 96px
      },
      
      // Animation & Transitions
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      
      // Transition Durations
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
      },
    },
  },
  plugins: [],
}
