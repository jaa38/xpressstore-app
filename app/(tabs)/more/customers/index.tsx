import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme, radius } from "@/theme";

export default function CustomersScreen() {
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
          paddingTop: spacing.md,
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
              <AppText variant="h1">Customers</AppText>

              <AppText variant="body" color="secondary">
                View and manage your customer records.
              </AppText>
            </View>

            {/* Add Button */}

            <Pressable
              onPress={() => {
                // router.push(ROUTES.ADD_CUSTOMER)
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: radius.full,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.action.primary.background,
              }}
            >
              <Ionicons
                name="add"
                size={24}
                color={theme.action.primary.text}
              />
            </Pressable>
          </View>

          {/* CONTENT */}

          <View
            style={{
              flex: 1,
              marginTop: spacing.md,
            }}
          >
            {/* Summary Card */}

            {/* Search */}

            {/* Filter Chips */}

            {/* Customer List */}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
