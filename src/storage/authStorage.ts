import * as SecureStore from "expo-secure-store";

import { ENV } from "@/config/env";

/**
 * ============================================================================
 * ACCESS TOKEN
 * ============================================================================
 */

export async function saveAccessToken(
  token: string
) {
  console.log(
    "================================="
  );

  console.log(
    "AUTH STORAGE → SAVING ACCESS TOKEN"
  );

  console.log(
    "STORAGE KEY:",
    ENV.TOKEN_STORAGE_KEY
  );

  console.log(
    "TOKEN EXISTS:",
    !!token
  );

  console.log(
    "================================="
  );

  await SecureStore.setItemAsync(
    ENV.TOKEN_STORAGE_KEY,
    token
  );

  /**
   * Verify that the token was actually written.
   */

  const saved =
    await SecureStore.getItemAsync(
      ENV.TOKEN_STORAGE_KEY
    );

  console.log(
    "AUTH STORAGE → ACCESS TOKEN SAVED:",
    !!saved
  );

  if (!saved) {
    throw new Error(
      "Failed to persist access token."
    );
  }
}

export async function getAccessToken() {
  console.log(
    "================================="
  );

  console.log(
    "AUTH STORAGE → GET ACCESS TOKEN"
  );

  console.log(
    "STORAGE KEY:",
    ENV.TOKEN_STORAGE_KEY
  );

  const token =
    await SecureStore.getItemAsync(
      ENV.TOKEN_STORAGE_KEY
    );

  console.log(
    "TOKEN EXISTS:",
    !!token
  );

  console.log(
    "================================="
  );

  return token;
}

export async function removeAccessToken() {
  console.log(
    "AUTH STORAGE → REMOVING ACCESS TOKEN"
  );

  console.log(
    "STORAGE KEY:",
    ENV.TOKEN_STORAGE_KEY
  );

  await SecureStore.deleteItemAsync(
    ENV.TOKEN_STORAGE_KEY
  );
}

/**
 * ============================================================================
 * REFRESH TOKEN
 * ============================================================================
 */

export async function saveRefreshToken(
  token: string
) {
  console.log(
    "================================="
  );

  console.log(
    "AUTH STORAGE → SAVING REFRESH TOKEN"
  );

  console.log(
    "STORAGE KEY:",
    ENV.REFRESH_TOKEN_STORAGE_KEY
  );

  console.log(
    "TOKEN EXISTS:",
    !!token
  );

  console.log(
    "================================="
  );

  await SecureStore.setItemAsync(
    ENV.REFRESH_TOKEN_STORAGE_KEY,
    token
  );

  /**
   * Verify persistence.
   */

  const saved =
    await SecureStore.getItemAsync(
      ENV.REFRESH_TOKEN_STORAGE_KEY
    );

  console.log(
    "AUTH STORAGE → REFRESH TOKEN SAVED:",
    !!saved
  );

  if (!saved) {
    throw new Error(
      "Failed to persist refresh token."
    );
  }
}

export async function getRefreshToken() {
  console.log(
    "================================="
  );

  console.log(
    "AUTH STORAGE → GET REFRESH TOKEN"
  );

  console.log(
    "STORAGE KEY:",
    ENV.REFRESH_TOKEN_STORAGE_KEY
  );

  const token =
    await SecureStore.getItemAsync(
      ENV.REFRESH_TOKEN_STORAGE_KEY
    );

  console.log(
    "REFRESH TOKEN EXISTS:",
    !!token
  );

  console.log(
    "================================="
  );

  return token;
}

export async function removeRefreshToken() {
  console.log(
    "AUTH STORAGE → REMOVING REFRESH TOKEN"
  );

  console.log(
    "STORAGE KEY:",
    ENV.REFRESH_TOKEN_STORAGE_KEY
  );

  await SecureStore.deleteItemAsync(
    ENV.REFRESH_TOKEN_STORAGE_KEY
  );
}

/**
 * ============================================================================
 * CURRENT USER
 * ============================================================================
 */

export async function saveCurrentUser<T>(
  user: T
) {
  console.log(
    "================================="
  );

  console.log(
    "AUTH STORAGE → SAVING CURRENT USER"
  );

  console.log(
    "STORAGE KEY:",
    ENV.USER_STORAGE_KEY
  );

  console.log(
    "USER EXISTS:",
    !!user
  );

  console.log(
    "================================="
  );

  const serializedUser =
    JSON.stringify(user);

  await SecureStore.setItemAsync(
    ENV.USER_STORAGE_KEY,
    serializedUser
  );

  /**
   * Verify that the user was actually written.
   */

  const saved =
    await SecureStore.getItemAsync(
      ENV.USER_STORAGE_KEY
    );

  console.log(
    "AUTH STORAGE → CURRENT USER SAVED:",
    !!saved
  );

  if (!saved) {
    throw new Error(
      "Failed to persist authenticated user."
    );
  }
}

export async function getCurrentUser<T>() {
  console.log(
    "================================="
  );

  console.log(
    "AUTH STORAGE → GET CURRENT USER"
  );

  console.log(
    "STORAGE KEY:",
    ENV.USER_STORAGE_KEY
  );

  const user =
    await SecureStore.getItemAsync(
      ENV.USER_STORAGE_KEY
    );

  console.log(
    "USER EXISTS:",
    !!user
  );

  console.log(
    "================================="
  );

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(
      user
    ) as T;
  } catch (error) {
    console.error(
      "AUTH STORAGE → FAILED TO PARSE CURRENT USER"
    );

    console.error(error);

    return null;
  }
}

export async function removeCurrentUser() {
  console.log(
    "AUTH STORAGE → REMOVING CURRENT USER"
  );

  console.log(
    "STORAGE KEY:",
    ENV.USER_STORAGE_KEY
  );

  await SecureStore.deleteItemAsync(
    ENV.USER_STORAGE_KEY
  );
}

/**
 * ============================================================================
 * CLEAR SESSION
 * ============================================================================
 */

export async function clearSession(
  reason = "UNKNOWN"
) {
  console.log(
    "================================="
  );

  console.log(
    "AUTH STORAGE → CLEARING SESSION"
  );

  console.log(
    "REASON:",
    reason
  );

  console.log(
    "================================="
  );

  await Promise.all([
    removeAccessToken(),
    removeRefreshToken(),
    removeCurrentUser(),
  ]);

  /**
   * Verify that the session was actually cleared.
   */

  const [
    accessToken,
    refreshToken,
    currentUser,
  ] = await Promise.all([
    SecureStore.getItemAsync(
      ENV.TOKEN_STORAGE_KEY
    ),

    SecureStore.getItemAsync(
      ENV.REFRESH_TOKEN_STORAGE_KEY
    ),

    SecureStore.getItemAsync(
      ENV.USER_STORAGE_KEY
    ),
  ]);

  console.log(
    "================================="
  );

  console.log(
    "AUTH STORAGE → SESSION CLEAR VERIFIED"
  );

  console.log(
    "ACCESS TOKEN EXISTS:",
    !!accessToken
  );

  console.log(
    "REFRESH TOKEN EXISTS:",
    !!refreshToken
  );

  console.log(
    "CURRENT USER EXISTS:",
    !!currentUser
  );

  console.log(
    "================================="
  );
}