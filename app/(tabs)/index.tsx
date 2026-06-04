import { View } from "react-native";

import { AppText } from "@/components/ui/AppText";
import { theme } from "@/theme";
import { Button } from "@/components/ui/Button";

import { router } from "expo-router";

import { clearSession } from "@/features/auth/services/session";

import { useAuthStore } from "@/features/auth/store/auth-store";

export default function HomeScreen() {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  async function handleLogout() {
    try {
      await clearSession();

      setAuthenticated(false);

      router.replace("/(auth)/login");
    } catch (error) {
      console.log("Logout Error:", error);
    }
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
      <AppText variant="h1">Home</AppText>

      <Button
        title="Logout"
        variant="primary"
        onPress={handleLogout}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}
