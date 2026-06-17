import { Stack } from "expo-router";

import {
  ProductProvider,
} from "@/store/product/ProductProvider";

export default function AddProductLayout() {
  return (
    <ProductProvider>
      <Stack
        screenOptions={{
          headerShown: false,

          animation:
            "slide_from_right",

          gestureEnabled: true,
        }}
      />
    </ProductProvider>
  );
}