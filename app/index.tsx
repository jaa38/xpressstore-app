import { useEffect } from "react";
import { View, Image } from "react-native";
import { router } from "expo-router";

import { useAuth } from "@/providers/AuthProvider";

import { isOnboardingComplete } from "@/services/auth/storage";

import { theme } from "@/theme";
import { ROUTES } from "@/navigation/routes";

export default function IndexScreen() {
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    bootstrap();
  }, [isLoading, isAuthenticated]);

  async function bootstrap() {
    const onboarded = await isOnboardingComplete();

    if (!onboarded) {
      router.replace(ROUTES.WELCOME);
      return;
    }

    if (isAuthenticated) {
      router.replace(ROUTES.TABS);
      return;
    }

    router.replace(ROUTES.LOGIN);
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
        style={{
          width: 270,
          height: 270,
          resizeMode: "contain",
        }}
      />
    </View>
  );
}
