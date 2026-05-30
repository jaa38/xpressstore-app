import { useEffect } from "react";

import { ActivityIndicator, StyleSheet, View } from "react-native";

import { router } from "expo-router";

import { AppText } from "@/components/ui/AppText";

import { getOnboarded } from "@/storage/app-storage";

import { getAccessToken } from "@/features/auth/services/session";

import { useAuthStore } from "@/features/auth/store/auth-store";

import { theme } from "@/theme";

export default function SplashScreen() {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    bootstrap();
  }, []);

  async function bootstrap() {
    const onboarded = await getOnboarded();

    const token = await getAccessToken();

    /**
     * FIRST TIME USER
     */

    if (!onboarded) {
      router.replace("/welcome");

      return;
    }

    /**
     * RETURNING LOGGED IN USER
     */

    if (token) {
      setAuthenticated(true);

      router.replace("/");

      return;
    }

    /**
     * RETURNING USER NOT LOGGED IN
     */

    router.replace("/login");

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <AppText variant="displayLarge">XpressStore</AppText>

      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",

    gap: 24,

    backgroundColor: theme.background.primary,
  },
});
