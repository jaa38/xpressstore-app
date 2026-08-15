import "react-native-reanimated";

import { Stack } from "expo-router";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { registerInterceptors } from "@/api/interceptors";

import { AppProvider } from "@/providers/app-provider";
import { ToastProvider } from "@/providers/toast-provider";


/**
 * Register Axios interceptors once.
 */
registerInterceptors();

export default function RootLayout() {
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
      }}
    >
      <BottomSheetModalProvider>
        <AppProvider>
          <ToastProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              />
          </ToastProvider>
        </AppProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}