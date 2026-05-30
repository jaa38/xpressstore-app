export const spacing = {
  none: 0,

  xs: 4,
  sm: 8,
  rg: 12,
  md: 16,
  lg: 24,
  xl: 32,

  "2xl": 40,
  "3xl": 48,
  "4xl": 64,
  "5xl": 80,
} as const;

export type Spacing = keyof typeof spacing;
