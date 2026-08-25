import { Stack } from "expo-router";

export default function DiscountCodesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="add/index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="view/index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
