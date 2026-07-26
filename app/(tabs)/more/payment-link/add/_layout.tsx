import { Stack } from "expo-router";

export default function AddPaymentLinkLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="information"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="review"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}