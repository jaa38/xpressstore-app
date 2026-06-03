import * as SecureStore from "expo-secure-store";

export async function completeOnboarding() {
  await SecureStore.setItemAsync("onboarding_complete", "true");
}

export async function isOnboardingComplete() {
  const value = await SecureStore.getItemAsync("onboarding_complete");

  return value === "true";
}
