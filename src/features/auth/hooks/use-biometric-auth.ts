import { useEffect } from "react";

import { router } from "expo-router";

import { ROUTES } from "@/navigation/routes";

import { authenticateWithBiometrics } from "@/services/biometrics";

import { isBiometricsEnabled } from "@/services/biometrics/storage";

export function useBiometricAuth() {
  useEffect(() => {
    async function checkBiometric() {
      const enabled = await isBiometricsEnabled();

      if (!enabled) {
        return;
      }

      const result = await authenticateWithBiometrics();

      if (result.success) {
        router.replace(ROUTES.TABS);
      }
    }

    checkBiometric();
  }, []);
}
