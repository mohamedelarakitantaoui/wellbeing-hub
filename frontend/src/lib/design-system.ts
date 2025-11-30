/**
 * 🎨 Design System - Wellness Dashboard
 * 
 * A comprehensive design system for a modern mental health platform
 * Inspired by: Notion, Headspace, Airbnb, Stripe Dashboard
 * 
 * Color Philosophy:
 * - Soft, calming backgrounds (creams, pastels)
 * - Warm accent colors for emotional safety
 * - Professional yet approachable
 * - Supports light & dark modes
 */

export const designSystem = {
  // ===== COLOR PALETTE =====
  colors: {
    // Primary Palette (Wellness Green/Teal)
    primary: {
      50: '#F0FDFA',
      100: '#CCFBF1',
      200: '#99F6E4',
      300: '#5EEAD4',
      400: '#2DD4BF',
      500: '#14B8A6', // Main teal
      600: '#0D9488',
      700: '#0F766E',
      800: '#115E59',
      900: '#134E4A',
    },
    
    // Secondary Palette (Warm Coral/Peach)
    secondary: {
      50: '#FFF7ED',
      100: '#FFEDD5',
      200: '#FED7AA',
      300: '#FDBA74',
      400: '#FB923C',
      500: '#F97316',
      600: '#EA580C',
      700: '#C2410C',
      800: '#9A3412',
      900: '#7C2D12',
    },
    
    // Accent Colors (Emotional Design)
    accent: {
      lavender: '#E9D5FF',
      peach: '#FED7AA',
      mint: '#D1FAE5',
      sky: '#BAE6FD',
      rose: '#FECDD3',
      gold: '#FDE68A',
    },
    
    // Status Colors
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    
    // Neutral Palette (Light Mode)
    neutral: {
      0: '#FFFFFF',
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0A0A0A',
    },
    
    // Dark Mode Palette
    dark: {
      bg: '#0F172A',
      card: '#1E293B',
      border: '#334155',
      text: {
        primary: '#F1F5F9',
        secondary: '#CBD5E1',
        muted: '#94A3B8',
      },
    },
  },

  // ===== TYPOGRAPHY =====
  typography: {
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      heading: "'Satoshi', 'Inter', sans-serif",
      mono: "'JetBrains Mono', 'Courier New', monospace",
    },
    
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
    },
    
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
  },

  // ===== SPACING =====
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '2.5rem', // 40px
    '3xl': '3rem',   // 48px
    '4xl': '4rem',   // 64px
    '5xl': '6rem',   // 96px
  },

  // ===== BORDER RADIUS =====
  borderRadius: {
    none: '0',
    sm: '0.375rem',   // 6px
    base: '0.5rem',   // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem',    // 32px
    full: '9999px',
  },

  // ===== SHADOWS =====
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
    
    // Colored shadows for premium feel
    primary: '0 10px 30px -5px rgba(20, 184, 166, 0.3)',
    secondary: '0 10px 30px -5px rgba(249, 115, 22, 0.3)',
  },

  // ===== ANIMATIONS =====
  animations: {
    duration: {
      fast: '150ms',
      base: '200ms',
      medium: '300ms',
      slow: '500ms',
    },
    
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    
    // Keyframe animations
    keyframes: {
      fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      slideUp: {
        from: { transform: 'translateY(20px)', opacity: 0 },
        to: { transform: 'translateY(0)', opacity: 1 },
      },
      slideDown: {
        from: { transform: 'translateY(-20px)', opacity: 0 },
        to: { transform: 'translateY(0)', opacity: 1 },
      },
      scaleIn: {
        from: { transform: 'scale(0.95)', opacity: 0 },
        to: { transform: 'scale(1)', opacity: 1 },
      },
      pulse: {
        '0%, 100%': { opacity: 1 },
        '50%': { opacity: 0.8 },
      },
    },
  },

  // ===== BREAKPOINTS =====
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // ===== COMPONENT STYLES =====
  components: {
    card: {
      light: {
        background: '#FFFFFF',
        border: '#E5E5E5',
        shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        hoverShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      dark: {
        background: '#1E293B',
        border: '#334155',
        shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
        hoverShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
      },
    },
    
    button: {
      primary: {
        background: '#14B8A6',
        hover: '#0D9488',
        text: '#FFFFFF',
      },
      secondary: {
        background: '#FAFAFA',
        hover: '#F5F5F5',
        text: '#171717',
      },
    },
  },
};

// ===== HELPER FUNCTIONS =====

/**
 * Get color with opacity
 */
export const withOpacity = (color: string, opacity: number): string => {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};

/**
 * Get responsive spacing
 */
export const responsiveSpacing = (mobile: string, desktop: string) => {
  return `${mobile} md:${desktop}`;
};

/**
 * Generate smooth gradient
 */
export const gradient = (from: string, to: string, direction = '135deg') => {
  return `linear-gradient(${direction}, ${from}, ${to})`;
};

/**
 * Mood to color mapping
 */
export const moodColors = {
  excellent: '#10B981',  // Green
  good: '#14B8A6',       // Teal
  okay: '#F59E0B',       // Amber
  difficult: '#F97316',  // Orange
  struggling: '#EF4444', // Red
};

/**
 * Role-specific colors
 */
export const roleColors = {
  student: '#14B8A6',      // Teal
  peer_supporter: '#8B5CF6', // Purple
  counselor: '#3B82F6',    // Blue
  moderator: '#F59E0B',    // Amber
  admin: '#EF4444',        // Red
};

export default designSystem;
