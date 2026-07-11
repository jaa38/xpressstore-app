import { Stack } from "expo-router";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AppProvider } from "@/providers/app-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { ProductProvider } from "@/store/product/ProductProvider";

import { useToast } from "@/hooks/useToast";

export default function RootLayout() {
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
      }}
    >
      <AppProvider>
        <ToastProvider>
          <ProductProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </ProductProvider>
        </ToastProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
