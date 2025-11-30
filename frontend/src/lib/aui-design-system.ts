/**
 * 🎨 Al Akhawayn University Design System
 * Official AUI Color Palette + Modern Wellness UI Extensions
 * 
 * Design Philosophy:
 * - Calm campus atmosphere
 * - Mint + green + teal harmony
 * - Friendly, not clinical
 * - Quiet emotional tone
 * - AUI identity but lighter and more approachable
 */

export const AUIColors = {
  // Primary AUI Green (Official Brand)
  primary: {
    DEFAULT: '#006F5F',      // Main AUI green (strong, solid)
    light: '#008477',        // Softer, fresher green
    dark: '#004C47',         // Deeper green for emphasis
    text: '#0C3C47',         // Deep blue-green for headers
  },
  
  // Background Palette (Calm & Clean)
  background: {
    mint: '#F2F7F6',         // Soft mint white (primary bg)
    white: '#FFFFFF',        // Clean white sections
    subtle: '#E4EFEF',       // Pale greenish gray
    card: '#FAFCFC',         // Card backgrounds
  },
  
  // Secondary & Accent Colors
  secondary: {
    teal: '#BEDFDA',         // Very soft teal
    blue: '#5FA2DD',         // Soft AUI sky blue
    mint: '#CDE7E4',         // Light mint for gradients
  },
  
  // Emotional Accents (Use Sparingly)
  accent: {
    amber: '#FFB347',        // Warm optimistic tone
    coral: '#E56E6E',        // Warm alerts (soft, not harsh)
    success: '#4CAF93',      // Completion/success states
    warning: '#FFB347',      // Gentle warnings
    error: '#E56E6E',        // Error states
  },
  
  // Text Hierarchy
  text: {
    primary: '#0C3C47',      // Headers & important text
    secondary: '#44504E',    // Body text
    muted: '#6B7A78',        // Secondary info
    disabled: '#9CAAA8',     // Disabled states
    inverse: '#FFFFFF',      // Text on dark backgrounds
  },
  
  // Borders & Dividers
  border: {
    light: '#E4EFEF',        // Subtle borders
    DEFAULT: '#D1E3E0',      // Standard borders
    strong: '#B8CCC9',       // Emphasized borders
  },
  
  // Shadows (Soft & Organic)
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 111, 95, 0.05)',
    DEFAULT: '0 2px 8px 0 rgba(0, 111, 95, 0.08)',
    md: '0 4px 16px 0 rgba(0, 111, 95, 0.10)',
    lg: '0 8px 24px 0 rgba(0, 111, 95, 0.12)',
    xl: '0 12px 32px 0 rgba(0, 111, 95, 0.15)',
  },
} as const;

export const AUIGradients = {
  // Soft mint gradient for main CTA
  mintWave: 'linear-gradient(135deg, #E4EFEF 0%, #CDE7E4 100%)',
  
  // Subtle green gradient for cards
  greenSoft: 'linear-gradient(135deg, #F2F7F6 0%, #E4EFEF 100%)',
  
  // Hero gradient
  heroGlow: 'linear-gradient(180deg, #FFFFFF 0%, #F2F7F6 100%)',
  
  // Privacy banner
  coralSoft: 'linear-gradient(135deg, rgba(229, 110, 110, 0.06) 0%, rgba(229, 110, 110, 0.02) 100%)',
  
  // Button hover states
  greenHover: 'linear-gradient(135deg, #008477 0%, #006F5F 100%)',
} as const;

export const AUITypography = {
  // Font Families
  fonts: {
    heading: "'Inter', 'Segoe UI', system-ui, sans-serif",
    body: "'Inter', 'Segoe UI', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'Courier New', monospace",
  },
  
  // Font Sizes (Harmonious Scale)
  sizes: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  },
  
  // Font Weights
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // Line Heights (Breathing Room)
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
} as const;

export const AUISpacing = {
  // Spacing Scale (8px base)
  scale: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },
} as const;

export const AUIBorderRadius = {
  // Organic, Friendly Shapes
  none: '0',
  sm: '0.375rem',     // 6px
  DEFAULT: '0.75rem', // 12px
  md: '1rem',         // 16px
  lg: '1.5rem',       // 24px
  xl: '1.75rem',      // 28px
  '2xl': '2rem',      // 32px
  pill: '9999px',     // Full pill shape
  circle: '50%',      // Perfect circle
} as const;

export const AUIBreakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * 🎭 Component-Specific Design Patterns
 */

export const AUIComponents = {
  // Button Styles
  button: {
    primary: {
      background: AUIColors.primary.DEFAULT,
      hoverBackground: AUIColors.primary.light,
      text: AUIColors.text.inverse,
      padding: '0.875rem 2rem',
      borderRadius: AUIBorderRadius.pill,
      shadow: AUIColors.shadow.DEFAULT,
      fontSize: AUITypography.sizes.base,
      fontWeight: AUITypography.weights.semibold,
    },
    secondary: {
      background: AUIColors.background.white,
      border: `1px solid ${AUIColors.border.DEFAULT}`,
      text: AUIColors.text.primary,
      padding: '0.875rem 2rem',
      borderRadius: AUIBorderRadius.pill,
    },
    ghost: {
      background: 'transparent',
      text: AUIColors.primary.DEFAULT,
      hoverBackground: AUIColors.background.subtle,
    },
  },
  
  // Card Styles
  card: {
    default: {
      background: AUIColors.background.white,
      border: `1px solid ${AUIColors.border.light}`,
      borderRadius: AUIBorderRadius.xl,
      shadow: AUIColors.shadow.DEFAULT,
      padding: AUISpacing.scale[6],
    },
    elevated: {
      background: AUIColors.background.white,
      borderRadius: AUIBorderRadius.xl,
      shadow: AUIColors.shadow.md,
      padding: AUISpacing.scale[8],
    },
    subtle: {
      background: AUIColors.background.subtle,
      border: 'none',
      borderRadius: AUIBorderRadius.lg,
      padding: AUISpacing.scale[6],
    },
  },
  
  // CTA Block (Main "Need to Talk?" section)
  ctaBlock: {
    background: AUIGradients.mintWave,
    borderRadius: AUIBorderRadius.xl,
    shadow: AUIColors.shadow.md,
    padding: AUISpacing.scale[8],
  },
  
  // Privacy Banner
  privacyBanner: {
    background: AUIGradients.coralSoft,
    border: `1px solid ${AUIColors.accent.coral}20`,
    borderRadius: AUIBorderRadius.lg,
    padding: AUISpacing.scale[5],
  },
  
  // Input Fields
  input: {
    background: AUIColors.background.white,
    border: `1px solid ${AUIColors.border.DEFAULT}`,
    borderRadius: AUIBorderRadius.md,
    padding: '0.75rem 1rem',
    focusBorder: AUIColors.primary.DEFAULT,
  },
} as const;

/**
 * 🎨 Utility Functions
 */

export const withOpacity = (color: string, opacity: number): string => {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};

export const getTextColor = (background: 'light' | 'dark'): string => {
  return background === 'light' ? AUIColors.text.primary : AUIColors.text.inverse;
};

/**
 * 🌈 Mood/Emotion Colors (Soft & Approachable)
 */

export const MoodColors = {
  great: {
    background: withOpacity(AUIColors.accent.success, 0.1),
    icon: AUIColors.accent.success,
    label: 'Feeling Great',
  },
  good: {
    background: withOpacity(AUIColors.secondary.blue, 0.1),
    icon: AUIColors.secondary.blue,
    label: 'Doing Well',
  },
  okay: {
    background: withOpacity(AUIColors.accent.amber, 0.1),
    icon: AUIColors.accent.amber,
    label: 'Hanging In',
  },
  struggling: {
    background: withOpacity(AUIColors.accent.coral, 0.1),
    icon: AUIColors.accent.coral,
    label: 'Need Support',
  },
  crisis: {
    background: withOpacity(AUIColors.accent.error, 0.15),
    icon: AUIColors.accent.error,
    label: 'In Crisis',
  },
} as const;

export default {
  colors: AUIColors,
  gradients: AUIGradients,
  typography: AUITypography,
  spacing: AUISpacing,
  borderRadius: AUIBorderRadius,
  breakpoints: AUIBreakpoints,
  components: AUIComponents,
  moodColors: MoodColors,
};
