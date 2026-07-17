import { colors } from "./colors";

/**
 * 🧠 Storefront Semantic Theme
 *
 * Components should ONLY use semantic tokens.
 * Never use raw colors directly inside components.
 */

export const theme = {
  /**
   * 🔤 TEXT
   */
  text: {
    primary: colors.gray[900],
    heading: colors.gray[800],
    strong: colors.gray[700],

    secondary: colors.gray[600],
    label: colors.gray[550],
    muted: colors.gray[500],
    placeholder: colors.gray[400],

    inverse: colors.neutral.white,

    brand: colors.primary[500],
    accent: colors.secondary[500],

    success: colors.success[600],
    error: colors.error[600],
    warning: colors.warning[600],
    info: colors.info[600],

    returned: colors.warning[500],

    link: colors.secondary[500],
  },

  /**
   * 🎨 BACKGROUNDS
   */
  background: {
    primary: colors.gray[50],
    surface: colors.neutral.white,
    subtle: colors.gray[100],

    brand: colors.primary[50],
    accent: colors.secondary[50],

    success: colors.success[100],
    error: colors.error[100],
    warning: colors.warning[100],
    info: colors.info[100],

    overlay: "rgba(0,0,0,0.4)",

    inverse: colors.gray[900],
  },

  /**
   * 📏 BORDERS
   */
  border: {
    default: colors.gray[200],
    light: colors.gray[100],
    strong: colors.gray[300],

    focus: colors.primary[500],

    success: colors.success[500],
    error: colors.error[500],
    warning: colors.warning[500],
    info: colors.info[500],

    brand: colors.primary[500],
    accent: colors.secondary[500],
  },

  /**
   * 🔘 UI Card
   */

  uicard: {
    default: {
      borderColor: colors.gray[300],
      text: colors.gray[800],
      backgroundColor: colors.neutral.white,
    },

    active: {
      backgroundColor: colors.primary[500],
      text: colors.neutral.white,
    },

    status: {
      backgroundColor: colors.primary[200],
      text: colors.primary[50],
    },
  },

  /**
   * 🔘 ACTIONS
   */
  action: {
    primary: {
      background: colors.primary[500],
      pressed: colors.primary[600],
      disabled: colors.gray[300],

      text: colors.neutral.white,
      disabledText: colors.gray[500],
      delete: colors.error[500],
    },

    secondary: {
      background: colors.secondary[500],
      pressed: colors.secondary[600],
      disabled: colors.gray[300],

      text: colors.neutral.white,
      disabledText: colors.gray[500],
    },

    tertiary: {
      background: colors.neutral.white,
      border: colors.primary[500],

      text: colors.primary[500],
      pressed: colors.primary[50],
    },

    ghost: {
      background: colors.neutral.transparent,
      pressed: colors.primary[50],

      text: colors.primary[500],
    },

    destructive: {
      background: colors.error[500],
      pressed: colors.error[600],

      text: colors.neutral.white,
    },

    link: {
      text: colors.secondary[500],
      pressed: colors.secondary[600],
    },
  },

  button: {
    primary: {
      background: colors.primary[500],
      text: colors.neutral.white,
      hover: colors.primary[600],
      pressed: colors.primary[700],
    },
    secondary: {
      background: colors.secondary[500],
      text: colors.neutral.white,
      hover: colors.secondary[600],
      pressed: colors.secondary[700],
    },
    disabled: {
      background: colors.gray[300],
      text: colors.neutral.white,
    },
  },

  /**
   * 🧾 INPUTS
   */
  input: {
    background: colors.neutral.white,

    text: colors.gray[900],
    placeholder: colors.gray[400],

    border: colors.gray[200],
    hoverBorder: colors.gray[300],

    focusBorder: colors.primary[500],

    disabledBackground: colors.gray[100],
    disabledText: colors.gray[400],

    errorBorder: colors.error[500],
    successBorder: colors.success[500],

    label: colors.gray[700],
    helper: colors.gray[500],

    icon: colors.gray[500],
  },

  /**
   * 🪪 CARDS
   */
  card: {
    default: {
      background: colors.neutral.white,
      border: colors.gray[200],
    },

    dashboard: {
      background: colors.primary[500],
      headerText: colors.primary[100],
      text: colors.primary[50],
    },

    stats: {
      background: colors.primary[300],
      text: colors.primary[100],
    },

    active: {
      background: colors.primary[50],
      border: colors.primary[500],
    },

    accent: {
      background: colors.secondary[50],
      border: colors.secondary[500],
    },

    success: {
      background: colors.success[100],
      border: colors.success[500],
    },

    error: {
      background: colors.error[100],
      border: colors.error[500],
    },

    warning: {
      background: colors.warning[100],
      border: colors.warning[500],
    },

    info: {
      background: colors.info[100],
      border: colors.info[500],
    },

    disabled: {
      background: colors.gray[100],
      border: colors.gray[300],
    },
  },

  /**
   * 🏷️ BADGES
   */
  badge: {
    primary: {
      background: colors.primary[100],
      text: colors.primary[600],
    },

    secondary: {
      background: colors.secondary[100],
      text: colors.secondary[600],
    },

    success: {
      background: colors.success[100],
      text: colors.success[600],
    },

    error: {
      background: colors.error[100],
      text: colors.error[600],
    },

    warning: {
      background: colors.warning[100],
      text: colors.warning[600],
    },

    info: {
      background: colors.info[100],
      text: colors.info[600],
    },
  },

  /**
   * 🔔 Input Fields
   */

  inputField: {
    default: {
      background: colors.neutral.white,
      border: colors.gray[300],
      text: colors.gray[400],
    },

    focus: {
      background: colors.neutral.white,
      border: colors.primary[500],
      text: colors.gray[400],
    },

    error: {
      background: colors.neutral.white,
      border: colors.error[500],
      text: colors.gray[400],
    },

    disabled: {
      background: colors.gray[100],
      border: colors.gray[300],
      text: colors.gray[400],
    },
  },

  /**
   * 🔔 Toggle Status States
   */

  toggleSwitch: {
    active: colors.primary[500],
    inactive: colors.secondary[500],
  },

  /**
   * 🔔 ALERTS / STATES
   */
  state: {
    success: {
      background: colors.success[100],
      border: colors.success[500],
      text: colors.success[600],
      icon: colors.success[600],
    },

    error: {
      background: colors.error[100],
      border: colors.error[500],
      text: colors.error[600],
      icon: colors.error[600],
    },

    warning: {
      background: colors.warning[100],
      border: colors.warning[500],
      text: colors.warning[600],
      icon: colors.warning[600],
    },

    info: {
      background: colors.info[100],
      border: colors.info[500],
      text: colors.info[600],
      icon: colors.info[600],
    },
  },

  /**
   * 🎯 ICONS
   */
  icon: {
    default: {
      background: colors.gray[100],
      icon: colors.gray[600],
    },

    branding: {
      background: colors.primary[100],
      icon: colors.primary[500],
    },

    tab: {
      active: colors.primary[500],
      inactive: colors.gray[400],
    },

    active: {
      background: colors.primary[500],
      icon: colors.neutral.white,
    },

    accent: {
      background: colors.secondary[100],
      icon: colors.secondary[600],
    },

    success: {
      background: colors.success[100],
      icon: colors.success[600],
    },

    error: {
      background: colors.error[100],
      icon: colors.error[600],
    },

    warning: {
      background: colors.warning[100],
      icon: colors.warning[600],
    },

    info: {
      background: colors.info[100],
      icon: colors.info[600],
    },

    delete: {
      background: colors.error[100],
      icon: colors.error[600],
    },
  },

  /**
   * 📦 ORDER STATUS
   */
  orderStatus: {
    all: {
      background: colors.neutral.white,
      border: colors.gray[300],
      text: colors.primary[500],
      icon: colors.primary[500],
    },

    delivered: {
      background: colors.success[100],
      border: colors.success[500],
      text: colors.success[500],
      icon: colors.success[500],
    },

    paid: {
      background: colors.primary[100],
      border: colors.primary[500],
      text: colors.primary[500],
      icon: colors.primary[500],
    },

    failed: {
      background: colors.error[100],
      border: colors.error[500],
      text: colors.error[500],
      icon: colors.error[500],
    },

    returned: {
      background: colors.warning[100],
      border: colors.warning[500],
      text: colors.warning[500],
      icon: colors.warning[500],
    },
  },

  /**
   * 🧭 NAVIGATION
   */
  navigation: {
    background: colors.neutral.white,
    border: colors.gray[200],

    active: colors.primary[500],
    inactive: colors.gray[400],

    textActive: colors.primary[500],
    textInactive: colors.gray[500],
  },

  /**
   * 📊 DIVIDERS
   */
  divider: {
    default: colors.gray[200],
    subtle: colors.gray[100],
    strong: colors.gray[300],
  },

  /**
   * 🌑 OVERLAY
   */
  overlay: {
    background: "rgba(0,0,0,0.5)",
  },

  /**
   * 🛒 E-COMMERCE / PAYMENTS
   */
  payment: {
    paid: {
      background: colors.success[100],
      border: colors.success[500],
      text: colors.success[600],
      badge: colors.success[500],
    },

    pending: {
      background: colors.warning[100],
      border: colors.warning[500],
      text: colors.warning[600],
      badge: colors.warning[500],
    },

    failed: {
      background: colors.error[100],
      border: colors.error[500],
      text: colors.error[600],
      badge: colors.error[500],
    },

    processing: {
      background: colors.info[100],
      border: colors.info[500],
      text: colors.info[600],
      badge: colors.info[500],
    },
  },
};
