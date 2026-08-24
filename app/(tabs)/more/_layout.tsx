import { Stack } from "expo-router";

export default function MoreLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="payment-link"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="business"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="settlements"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="customers"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="security"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="payment-settings"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="transactions"
        options={{
          headerShown: false,
        }}
      />

      {/* Categories */}

      <Stack.Screen
        name="categories"
        options={{
          headerShown: false,
        }}
      />

      {/* Discount Codes */}

      <Stack.Screen
        name="discount-codes"
        options={{
          headerShown: false,
        }}
      />

      {/* Notifications */}

      <Stack.Screen
        name="notifications"
        options={{
          headerShown: false,
        }}
      />

      {/* Settings */}

      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
        }}
      />

      {/* Support */}

      <Stack.Screen
        name="support"
        options={{
          headerShown: false,
        }}
      />

      {/* About */}

      <Stack.Screen
        name="about"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
