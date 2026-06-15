import { Stack } from "expo-router";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AppProvider } from "@/providers/app-provider";

export default function RootLayout() {
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
      }}
    >
      <AppProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </AppProvider>
    </GestureHandlerRootView>
  );
}
