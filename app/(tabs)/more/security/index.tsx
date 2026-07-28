import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme, radius } from "@/theme";

export default function SecurityScreen() {
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
          // paddingTop: spacing.md,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          {/* HEADER */}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            {/* Back Button */}

            <Pressable
              onPress={() => router.back()}
              style={{
                width: 44,
                height: 44,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.text.primary}
              />
            </Pressable>

            {/* Title */}

            <View
              style={{
                flex: 1,
                gap: spacing.xs,
              }}
            >
              <AppText variant="h1">Security</AppText>

              <AppText variant="body" color="secondary">
                Manage your password, PIN and account security settings.
              </AppText>
            </View>

            {/* Edit Button */}
          </View>

          {/* CONTENT */}

          <View
            style={{
              flex: 1,
              marginTop: spacing.md,
            }}
          >
            {/* Security Overview */}

            {/* Password */}

            {/* Transaction PIN */}

            {/* Two-Factor Authentication */}

            {/* Active Devices */}

            {/* Login History */}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
