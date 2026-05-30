import { useEffect } from "react";

import {
  View,
  Image,
} from "react-native";

import { router } from "expo-router";

import { getAccessToken } from "@/features/auth/services/session";

import { useAuthStore } from "@/features/auth/store/auth-store";

import { getOnboarded } from "@/storage/app-storage";

import { theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";

export default function IndexScreen() {
  const setAuthenticated =
    useAuthStore(
      (state) => state.setAuthenticated
    );

  const setLoading =
    useAuthStore(
      (state) => state.setLoading
    );

  useEffect(() => {
    const timeout = setTimeout(() => {
      bootstrap();
    }, 2000);

    return () =>
      clearTimeout(timeout);
  }, []);

  async function bootstrap() {
    const onboarded =
      await getOnboarded();

    const token =
      await getAccessToken();

    /**
     * FIRST-TIME USER
     */

    if (!onboarded) {
      router.replace(
        ROUTES.WELCOME
      );

      return;
    }

    /**
     * RETURNING LOGGED-IN USER
     */

    if (token) {
      setAuthenticated(true);

      router.replace(
        ROUTES.TABS
      );

      return;
    }

    /**
     * RETURNING USER
     * NOT LOGGED IN
     *
     * Currently routed to
     * Sign Up while testing
     * onboarding flow.
     */

    router.replace(
      ROUTES.SIGNUP
    );

    setLoading(false);
  }

  return (
    <View
      style={{
        flex: 1,

        justifyContent:
          "center",

        alignItems:
          "center",

        backgroundColor:
          theme.background.primary,
      }}
    >
      <Image
        source={require("../assets/logo/xpressStoreLogo.png")}
        style={{
          width: 270,
          height: 270,

          resizeMode:
            "contain",
        }}
      />
    </View>
  );
}