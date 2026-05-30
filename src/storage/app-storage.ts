import * as SecureStore from "expo-secure-store";

const ONBOARDED_KEY =
  "is_onboarded";

/**
 * Save onboarding state
 */
export async function setOnboarded() {
  await SecureStore.setItemAsync(
    ONBOARDED_KEY,
    "true"
  );
}

/**
 * Get onboarding state
 */
export async function getOnboarded() {
  const value =
    await SecureStore.getItemAsync(
      ONBOARDED_KEY
    );

  return value === "true";
}