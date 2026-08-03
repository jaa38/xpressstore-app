import {
  getItem,
  setItem,
} from "@/storage/storage";

import { STORAGE_KEYS } from "@/constants/storageKeys";

export async function setOnboarded() {
  await setItem(
    STORAGE_KEYS.ONBOARDING_COMPLETE,
    "true"
  );
}

export async function getOnboarded() {
  return (
    (await getItem(
      STORAGE_KEYS.ONBOARDING_COMPLETE
    )) === "true"
  );
}