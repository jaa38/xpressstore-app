import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import * as SecureStore from "expo-secure-store";

import { theme as lightTheme } from "./theme";

const SETTINGS_STORAGE_KEY = "xpressstore_app_settings";

type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  mode: ThemeMode;
  isDark: boolean;
  setDarkMode: (enabled: boolean) => Promise<void>;
  theme: typeof lightTheme;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Dark semantic theme.
 *
 * Brand colours remain unchanged while surfaces, text, borders,
 * cards and navigation adapt to the dark appearance.
 */
const darkTheme: typeof lightTheme = {
  ...lightTheme,

  text: {
    ...lightTheme.text,
    primary: "#F8FAFC",
    heading: "#FFFFFF",
    strong: "#E2E8F0",
    secondary: "#CBD5E1",
    label: "#CBD5E1",
    muted: "#94A3B8",
    placeholder: "#64748B",
    inverse: "#0F172A",
  },

  background: {
    ...lightTheme.background,
    primary: "#0F172A",
    surface: "#111827",
    subtle: "#1E293B",
    inverse: "#F8FAFC",
    overlay: "rgba(0,0,0,0.65)",
  },

  border: {
    ...lightTheme.border,
    default: "#334155",
    light: "#1E293B",
    strong: "#475569",
  },

  uicard: {
    ...lightTheme.uicard,
    default: {
      ...lightTheme.uicard.default,
      borderColor: "#334155",
      text: "#F8FAFC",
      backgroundColor: "#111827",
    },
  },

  card: {
    ...lightTheme.card,
    default: {
      ...lightTheme.card.default,
      background: "#111827",
      border: "#334155",
    },
  },

  icon: {
    ...lightTheme.icon,
    default: {
      ...lightTheme.icon.default,
      background: "#1E293B",
      icon: "#CBD5E1",
    },
    branding: {
      ...lightTheme.icon.branding,
    },
  },

  navigation: {
    ...lightTheme.navigation,
    background: "#111827",
    border: "#334155",
    inactive: "#64748B",
    textInactive: "#94A3B8",
  },

  divider: {
    ...lightTheme.divider,
    default: "#334155",
    subtle: "#1E293B",
    strong: "#475569",
  },

  listItem: {
    ...lightTheme.listItem,
    default: {
      ...lightTheme.listItem.default,
      background: "transparent",
      title: "#F8FAFC",
      subtitle: "#94A3B8",
      icon: "#CBD5E1",
      chevron: "#64748B",
    },
    pressed: {
      ...lightTheme.listItem.pressed,
      background: "#1E293B",
    },
    selected: {
      ...lightTheme.listItem.selected,
    },
  },

  input: {
    ...lightTheme.input,
  },

  inputField: {
    ...lightTheme.inputField,
  },

  overlay: {
    ...lightTheme.overlay,
    background: "rgba(0,0,0,0.65)",
  },
};

export function ThemeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    async function loadTheme() {
      try {
        const storedSettings =
          await SecureStore.getItemAsync(SETTINGS_STORAGE_KEY);

        if (!storedSettings) {
          return;
        }

        const parsedSettings = JSON.parse(storedSettings) as {
          darkMode?: boolean;
        };

        setMode(parsedSettings.darkMode ? "dark" : "light");
      } catch (error) {
        console.error("Unable to load theme preference:", error);
      }
    }

    void loadTheme();
  }, []);

  const setDarkMode = async (enabled: boolean) => {
    setMode(enabled ? "dark" : "light");

    try {
      const storedSettings =
        await SecureStore.getItemAsync(SETTINGS_STORAGE_KEY);

      const currentSettings = storedSettings ? JSON.parse(storedSettings) : {};

      await SecureStore.setItemAsync(
        SETTINGS_STORAGE_KEY,
        JSON.stringify({
          ...currentSettings,
          darkMode: enabled,
        })
      );
    } catch (error) {
      console.error("Unable to save theme preference:", error);
    }
  };

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      isDark: mode === "dark",
      setDarkMode,
      theme: mode === "dark" ? darkTheme : lightTheme,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
