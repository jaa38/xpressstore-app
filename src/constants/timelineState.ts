import { theme } from "@/theme";

export const TIMELINE_STATE = {
  completed: {
    background:
      theme.state.success.background,

    icon: theme.icon.success.icon,

    text: theme.text.success,

    line:
      theme.state.success.background,
  },

  current: {
    background:
      theme.icon.branding.background,

    icon:
      theme.icon.branding.icon,

    text:
      theme.text.brand,

    line:
      theme.icon.branding.background,
  },

  pending: {
    background:
      theme.background.subtle,

    icon:
      theme.icon.default.icon,

    text:
      theme.text.secondary,

    line:
      theme.divider.default,
  },

  error: {
    background:
      theme.state.error.background,

    icon:
      theme.icon.error.icon,

    text:
      theme.text.error,

    line:
      theme.state.error.background,
  },
} as const;