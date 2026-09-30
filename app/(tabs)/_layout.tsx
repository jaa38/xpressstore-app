// import { Tabs, router } from "expo-router";

// import { Ionicons } from "@expo/vector-icons";

// import { theme } from "@/theme";

// import { ROUTES } from "@/navigation/routes";

// /**
//  * ============================================================================
//  * MAIN APPLICATION TAB NAVIGATION
//  * ============================================================================
//  */

// export default function TabsLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,

//         tabBarActiveTintColor: theme.icon.tab.active,

//         tabBarInactiveTintColor: theme.icon.tab.inactive,
//       }}
//     >
//       {/* ==================================================================
//           HOME
//       ================================================================== */}

//       <Tabs.Screen
//         name="index"
//         options={{
//           title: "Home",

//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="home-outline" size={size} color={color} />
//           ),
//         }}
//       />

//       {/* ==================================================================
//           STOREFRONT
//       ================================================================== */}

//       <Tabs.Screen
//         name="store"
//         options={{
//           title: "Storefront",

//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="storefront-outline" size={size} color={color} />
//           ),
//         }}
//       />

//       {/* ==================================================================
//           ORDERS
//       ================================================================== */}

//       <Tabs.Screen
//         name="orders"
//         options={{
//           title: "Orders",

//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="receipt-outline" size={size} color={color} />
//           ),
//         }}
//       />

//       {/* ==================================================================
//           PRODUCTS
//       ================================================================== */}

//       <Tabs.Screen
//         name="products"
//         options={{
//           title: "Products",

//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="cube-outline" size={size} color={color} />
//           ),
//         }}
//       />

//       {/* ==================================================================
//           MORE
//       ================================================================== */}

//       <Tabs.Screen
//         name="more"
//         listeners={{
//           tabPress: (event) => {
//             /**
//              * Prevent React Navigation from restoring the
//              * previously active screen in the More stack.
//              */

//             event.preventDefault();

//             /**
//              * Always open the root More screen.
//              */

//             router.navigate(ROUTES.MORE);
//           },
//         }}
//         options={{
//           title: "More",

//           tabBarIcon: ({ color, size }) => (
//             <Ionicons
//               name="ellipsis-horizontal-circle-outline"
//               size={size}
//               color={color}
//             />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }

import { NativeTabs } from "expo-router/unstable-native-tabs";

import { theme } from "@/theme";

/**
 * ============================================================================
 * MAIN APPLICATION NATIVE TAB NAVIGATION
 * ============================================================================
 */

export default function TabsLayout() {
  return (
    <NativeTabs
      tintColor={theme.icon.branding.icon}
      disableTransparentOnScrollEdge
      tabBarRespectsIMEInsets
    >
      {/* ==================================================================
          HOME
      ================================================================== */}

      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: "house",
            selected: "house.fill",
          }}
        />
      </NativeTabs.Trigger>

      {/* ==================================================================
          STOREFRONT
      ================================================================== */}

      <NativeTabs.Trigger name="store">
        <NativeTabs.Trigger.Label>Storefront</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: "storefront",
            selected: "storefront.fill",
          }}
        />
      </NativeTabs.Trigger>

      {/* ==================================================================
          ORDERS
      ================================================================== */}

      <NativeTabs.Trigger name="orders">
        <NativeTabs.Trigger.Label>Orders</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: "receipt",
            selected: "receipt.fill",
          }}
        />
      </NativeTabs.Trigger>

      {/* ==================================================================
          PRODUCTS
      ================================================================== */}

      <NativeTabs.Trigger name="products">
        <NativeTabs.Trigger.Label>Products</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: "shippingbox",
            selected: "shippingbox.fill",
          }}
        />
      </NativeTabs.Trigger>

      {/* ==================================================================
          MORE
      ================================================================== */}

      <NativeTabs.Trigger name="more">
        <NativeTabs.Trigger.Label>More</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: "ellipsis.circle",
            selected: "ellipsis.circle.fill",
          }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
