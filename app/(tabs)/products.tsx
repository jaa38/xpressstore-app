import { View, Pressable } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";

import { spacing, theme } from "@/theme";

export default function ProductScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
    >
      <StatusBar style="auto" />

      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing.lg,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          {/* TOP */}

          <View
            style={{
              marginTop: spacing.lg,
              gap: spacing.lg,
            }}
          >
            <View
              style={{
                gap: spacing.xs,
              }}
            >
              <AppText variant="h1">Welcome Back</AppText>

              <AppText variant="body" color="secondary">
                Sign in to manage your store.
              </AppText>
            </View>

            {/* Email Input */}

            {/* Password Input */}
          </View>

          {/* BOTTOM */}

          <View
            style={{
              paddingBottom: spacing.lg,
            }}
          ></View>
        </View>
      </View>
    </SafeAreaView>
  );
}
