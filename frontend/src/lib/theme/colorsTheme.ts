
export const colorsTheme = {
  colors: {
    // Backgrounds
    background: {
      primary: '#0a0a0a',
      secondary: '#0f0f0f',
      tertiary: '#141414',
      card: '#141414',
      input: '#1a1a1a',
      skeleton: '#1e1e1e',
    },
    
    // Accent Color (Lime/Yellow)
    accent: {
      primary: '#c8ff00',
      primaryHover: 'rgba(200, 255, 0, 0.8)',
      primaryBg: 'rgba(200, 255, 0, 0.1)',
      primaryBgStrong: 'rgba(200, 255, 0, 0.2)',
      glow: 'rgba(200, 255, 0, 0.05)',
      onPrimary: '#0a0a0a',
    },
    
    // Text Colors
    text: {
      primary: '#f5f5f5',
      secondary: '#888888',
      tertiary: '#888888',
      onAccent: '#0a0a0a',
    },
    
    // Borders
    border: {
      primary: 'rgba(255, 255, 255, 0.08)',
      secondary: 'rgba(255, 255, 255, 0.06)',
      input: 'rgba(255, 255, 255, 0.08)',
    },
    
    // Success/Toast Colors
    success: {
      bg: '#001f0f',
      border: '#003d1c',
      text: '#59f3a6',
    },
    
    // Badge/Tag Colors
    badge: {
      savedBg: '#c8ff00',
      savedText: '#0a0a0a',
      idBorder: 'rgba(255, 255, 255, 0.08)',
    },
  },
  
  typography: {
    fontFamily: {
      primary: "'Inter', sans-serif",
    },
    fontSize: {
      xs: '12px',
      sm: '13px',
      base: '14px',
      lg: '16px',
      xl: '18px',
      '2xl': '24px',
    },
    lineHeight: {
      tight: '16px',
      normal: '20px',
      relaxed: '24px',
      loose: '28px',
      extra: '36px',
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
    },
  },
  
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
  },
  
  borderRadius: {
    sm: '8px',
    md: '10px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  sizes: {
    input: {
      height: '36px',
    },
    button: {
      heightSm: '32px',
      heightMd: '36px',
    },
    avatar: {
      sm: '32px',
      md: '48px',
    },
    sidebar: {
      width: '256px',
    },
    header: {
      height: '56px',
    },
  },
  
  shadows: {
    sm: '0px 0px 0px 2px rgba(255, 255, 255, 0.08)',
    md: '0px 4px 12px 0px rgba(0, 0, 0, 0.1)',
    blur: 'blur(64px)',
  },
  
  opacity: {
    disabled: '0.4',
    skeleton: '0.72',
    hover: '0.5',
  },
} as const;

export type ColorsTheme = typeof colorsTheme;
