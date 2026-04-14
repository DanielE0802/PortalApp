import { colorsTheme } from './colorsTheme';

/**
 * Definición de temas disponibles
 */

export interface Theme {
  id: string;
  name: string;
  cssVars: Record<string, string>;
}

export const themes: Theme[] = [
  {
    id: 'portalapp-dark',
    name: 'PortalApp - Dark',
    cssVars: {
      // Backgrounds
      '--background-primary': colorsTheme.colors.background.primary,
      '--background-secondary': colorsTheme.colors.background.secondary,
      '--background-tertiary': colorsTheme.colors.background.tertiary,
      '--background-card': colorsTheme.colors.background.card,
      '--background-input': colorsTheme.colors.background.input,
      '--background-skeleton': colorsTheme.colors.background.skeleton,
      
      // Accent
      '--accent-primary': colorsTheme.colors.accent.primary,
      '--accent-primary-hover': colorsTheme.colors.accent.primaryHover,
      '--accent-primary-bg': colorsTheme.colors.accent.primaryBg,
      '--accent-primary-bg-strong': colorsTheme.colors.accent.primaryBgStrong,
      '--accent-glow': colorsTheme.colors.accent.glow,
      '--accent-on-primary': colorsTheme.colors.accent.onPrimary,
      
      // Text
      '--text-primary': colorsTheme.colors.text.primary,
      '--text-secondary': colorsTheme.colors.text.secondary,
      '--text-tertiary': colorsTheme.colors.text.tertiary,
      '--text-on-accent': colorsTheme.colors.text.onAccent,
      
      // Borders
      '--border-primary': colorsTheme.colors.border.primary,
      '--border-secondary': colorsTheme.colors.border.secondary,
      '--border-input': colorsTheme.colors.border.input,
      
      // Success
      '--success-bg': colorsTheme.colors.success.bg,
      '--success-border': colorsTheme.colors.success.border,
      '--success-text': colorsTheme.colors.success.text,
      
      // Badge
      '--badge-saved-bg': colorsTheme.colors.badge.savedBg,
      '--badge-saved-text': colorsTheme.colors.badge.savedText,
      '--badge-id-border': colorsTheme.colors.badge.idBorder,
      
      // Typography
      '--font-primary': colorsTheme.typography.fontFamily.primary,
      
      // Spacing
      '--space-1': colorsTheme.spacing[1],
      '--space-2': colorsTheme.spacing[2],
      '--space-3': colorsTheme.spacing[3],
      '--space-4': colorsTheme.spacing[4],
      '--space-5': colorsTheme.spacing[5],
      '--space-6': colorsTheme.spacing[6],
      '--space-8': colorsTheme.spacing[8],
      
      // Border Radius
      '--radius-sm': colorsTheme.borderRadius.sm,
      '--radius-md': colorsTheme.borderRadius.md,
      '--radius-lg': colorsTheme.borderRadius.lg,
      '--radius-xl': colorsTheme.borderRadius.xl,
      '--radius-full': colorsTheme.borderRadius.full,
      
      // Sizes
      '--input-height': colorsTheme.sizes.input.height,
      '--button-height-sm': colorsTheme.sizes.button.heightSm,
      '--button-height-md': colorsTheme.sizes.button.heightMd,
      '--avatar-sm': colorsTheme.sizes.avatar.sm,
      '--avatar-md': colorsTheme.sizes.avatar.md,
      '--sidebar-width': colorsTheme.sizes.sidebar.width,
      '--header-height': colorsTheme.sizes.header.height,
      
      // Shadows
      '--shadow-sm': colorsTheme.shadows.sm,
      '--shadow-md': colorsTheme.shadows.md,
      '--blur-glow': colorsTheme.shadows.blur,
      
      // Opacity
      '--opacity-disabled': colorsTheme.opacity.disabled,
      '--opacity-skeleton': colorsTheme.opacity.skeleton,
      '--opacity-hover': colorsTheme.opacity.hover,
    },
  },
];

export const defaultTheme = themes[0];

export function getThemeById(id: string): Theme | undefined {
  return themes.find((theme) => theme.id === id);
}
