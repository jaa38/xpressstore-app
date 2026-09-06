import { Stack } from "expo-router";

/**
 * ============================================================================
 * MORE STACK NAVIGATION
 * ============================================================================
 *
 * The More tab has its own navigation stack.
 *
 * Structure:
 *
 * More
 * ├── index
 * ├── payment-link
 * ├── business
 * ├── settlements
 * ├── customers
 * ├── security
 * ├── payment-settings
 * ├── transactions
 * ├── categories
 * ├── discount-codes
 * ├── notifications
 * ├── settings
 * ├── support
 * └── about
 */

export default function MoreLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* ==================================================================
          MORE HOME
      ================================================================== */}

      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      {/* ==================================================================
          PAYMENT LINKS
      ================================================================== */}

      <Stack.Screen
        name="payment-link"
        options={{
          headerShown: false,
        }}
      />

      {/* ==================================================================
          BUSINESS
      ================================================================== */}

      <Stack.Screen
        name="business"
        options={{
          headerShown: false,
        }}
      />

      {/* ==================================================================
          SETTLEMENTS
      ================================================================== */}

      <Stack.Screen
        name="settlements"
        options={{
          headerShown: false,
        }}
      />

      {/* ==================================================================
          CUSTOMERS
      ================================================================== */}

      <Stack.Screen
        name="customers"
        options={{
          headerShown: false,
        }}
      />

      {/* ==================================================================
          SECURITY
      ================================================================== */}

      <Stack.Screen
        name="security"
        options={{
          headerShown: false,
        }}
      />

      {/* ==================================================================
          PAYMENT SETTINGS
      ================================================================== */}

      <Stack.Screen
        name="payment-settings"
        options={{
          headerShown: false,
        }}
      />

      {/* ==================================================================
          TRANSACTIONS
      ================================================================== */}

      <Stack.Screen
        name="transactions"
        options={{
          headerShown: false,
        }}
      />

      {/* ==================================================================
          CATEGORIES
      ================================================================== */}

      <Stack.Screen
        name="categories"
        options={{
          headerShown: false,
        }}
      />

      {/* ==================================================================
          DISCOUNT CODES
      ================================================================== */}

      <Stack.Screen
        name="discount-codes"
        options={{
          headerShown: false,
        }}
      />

      {/* ==================================================================
          NOTIFICATIONS
      ================================================================== */}

      <Stack.Screen
        name="notifications"
        options={{
          headerShown: false,
        }}
      />

      {/* ==================================================================
          SETTINGS
      ================================================================== */}

      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
        }}
      />

      {/* ==================================================================
          SUPPORT
      ================================================================== */}

      <Stack.Screen
        name="support"
        options={{
          headerShown: false,
        }}
      />

      {/* ==================================================================
          ABOUT
      ================================================================== */}

      <Stack.Screen
        name="about"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
