import * as SecureStore from "expo-secure-store";

import { ENV } from "@/config/env";

export async function saveAccessToken(
  token: string
) {
  await SecureStore.setItemAsync(
    ENV.TOKEN_STORAGE_KEY,
    token
  );
}

export async function getAccessToken() {
  return SecureStore.getItemAsync(
    ENV.TOKEN_STORAGE_KEY
  );
}

export async function removeAccessToken() {
  await SecureStore.deleteItemAsync(
    ENV.TOKEN_STORAGE_KEY
  );
}

export async function saveRefreshToken(
  token: string
) {
  await SecureStore.setItemAsync(
    ENV.REFRESH_TOKEN_STORAGE_KEY,
    token
  );
}

export async function getRefreshToken() {
  return SecureStore.getItemAsync(
    ENV.REFRESH_TOKEN_STORAGE_KEY
  );
}

export async function removeRefreshToken() {
  await SecureStore.deleteItemAsync(
    ENV.REFRESH_TOKEN_STORAGE_KEY
  );
}

export async function saveCurrentUser<T>(
  user: T
) {
  await SecureStore.setItemAsync(
    ENV.USER_STORAGE_KEY,
    JSON.stringify(user)
  );
}

export async function getCurrentUser<T>() {
  const user =
    await SecureStore.getItemAsync(
      ENV.USER_STORAGE_KEY
    );

  if (!user) {
    return null;
  }

  return JSON.parse(user) as T;
}

export async function removeCurrentUser() {
  await SecureStore.deleteItemAsync(
    ENV.USER_STORAGE_KEY
  );
}

export async function clearSession() {
  await Promise.all([
    removeAccessToken(),
    removeRefreshToken(),
    removeCurrentUser(),
  ]);
}