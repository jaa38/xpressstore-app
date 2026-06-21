import { Stack } from "expo-router";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AppProvider } from "@/providers/app-provider";
import { ProductProvider } from "@/store/product/ProductProvider";

export default function RootLayout() {
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
      }}
    >
      <AppProvider>
        <ProductProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </ProductProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
