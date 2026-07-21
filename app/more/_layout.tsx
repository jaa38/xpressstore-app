import { Stack } from "expo-router";
import { theme, typography } from "@/theme";

export default function MoreLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerBackButtonDisplayMode: "minimal",

        headerStyle: {
          backgroundColor: theme.background.primary,
        },

        headerTintColor: theme.text.primary,

        headerTitleStyle: {
          ...typography.navigationTitle,
          color: theme.text.primary,
        },

        contentStyle: {
          backgroundColor: theme.background.primary,
        },
      }}
    >
      <Stack.Screen
        name="payment-link"
        options={{
          title: "Payment Links",
        }}
      />

      <Stack.Screen
        name="business"
        options={{
          title: "Business",
        }}
      />

      <Stack.Screen
        name="settlements"
        options={{
          title: "Settlements",
        }}
      />

      <Stack.Screen
        name="customers"
        options={{
          title: "Customers",
        }}
      />

      <Stack.Screen
        name="security"
        options={{
          title: "Security",
        }}
      />
    </Stack>
  );
}