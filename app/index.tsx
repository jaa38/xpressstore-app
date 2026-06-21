import { useEffect } from "react";
import { View, Image } from "react-native";
import { router } from "expo-router";

import { hasValidSession } from "@/features/auth/services/session";
import { isOnboardingComplete } from "@/services/auth/storage";
import { useAuthStore } from "@/features/auth/store/auth-store";

import { theme } from "@/theme";
import { ROUTES } from "@/navigation/routes";

export default function IndexScreen() {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const timeout = setTimeout(() => {
      bootstrap();
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  async function bootstrap() {
    const onboarded = await isOnboardingComplete();
    const sessionValid = await hasValidSession();

    /**
     * FIRST-TIME USER
     */
    if (!onboarded) {
      router.replace(ROUTES.WELCOME);
      setLoading(false);
      return;
    }

    /**
     * RETURNING LOGGED-IN USER
     */
    if (sessionValid) {
      setAuthenticated(true);
      router.replace(ROUTES.TABS);
      setLoading(false);
      return;
    }

    /**
     * RETURNING USER, NOT LOGGED IN
     */
    router.replace(ROUTES.WELCOME);
    setLoading(false);
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.background.primary,
      }}
    >
      <Image
        source={require("../assets/logo/xpressStoreLogo.png")}
        style={{ width: 270, height: 270, resizeMode: "contain" }}
      />
    </View>
  );
}