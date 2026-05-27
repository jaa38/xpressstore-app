import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="store"
        options={{
          title: "Store",
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
        }}
      />

      <Tabs.Screen
        name="products"
        options={{
          title: "Products",
        }}
      />

      <Tabs.Screen
        name="more"
        options={{
          title: "More",
        }}
      />
    </Tabs>
  );
}