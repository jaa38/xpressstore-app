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
        <NativeTabs.Trigger.Label>
          Home
        </NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: "house",
            selected: "house.fill",
          }}
          md={{
            default: "home",
            selected: "home_filled",
          }}
        />
      </NativeTabs.Trigger>

      {/* ==================================================================
          STOREFRONT
      ================================================================== */}

      <NativeTabs.Trigger name="store">
        <NativeTabs.Trigger.Label>
          Storefront
        </NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: "storefront",
            selected: "storefront.fill",
          }}
          md={{
            default: "storefront",
            selected: "storefront",
          }}
        />
      </NativeTabs.Trigger>

      {/* ==================================================================
          ORDERS
      ================================================================== */}

      <NativeTabs.Trigger name="orders">
        <NativeTabs.Trigger.Label>
          Orders
        </NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: "receipt",
            selected: "receipt.fill",
          }}
          md={{
            default: "receipt_long",
            selected: "receipt_long",
          }}
        />
      </NativeTabs.Trigger>

      {/* ==================================================================
          PRODUCTS
      ================================================================== */}

      <NativeTabs.Trigger name="products">
        <NativeTabs.Trigger.Label>
          Products
        </NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: "shippingbox",
            selected: "shippingbox.fill",
          }}
          md={{
            default: "inventory_2",
            selected: "inventory_2",
          }}
        />
      </NativeTabs.Trigger>

      {/* ==================================================================
          MORE
      ================================================================== */}

      <NativeTabs.Trigger name="more">
        <NativeTabs.Trigger.Label>
          More
        </NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: "ellipsis.circle",
            selected: "ellipsis.circle.fill",
          }}
          md={{
            default: "more_horiz",
            selected: "more_horiz",
          }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}