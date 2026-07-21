import { Stack } from "expo-router";

export default function MoreLayout() {
  return (
    <Stack>
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
    </Stack>
  );
}