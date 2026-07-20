import "react-native-reanimated";

import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AppProvider } from "@/providers/app-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { ProductProvider } from "@/store/product/ProductProvider";
import { QueryProvider } from "@/providers/query-provider";

export default function RootLayout() {
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
      }}
    >
      <BottomSheetModalProvider>
        <AppProvider>
          <QueryProvider>
            <ToastProvider>
              <ProductProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                  }}
                />
              </ProductProvider>
            </ToastProvider>
          </QueryProvider>
        </AppProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
