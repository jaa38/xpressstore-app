import { AxiosError, InternalAxiosRequestConfig } from "axios";

import { apiClient, authClient } from "./client";

import { getAccessToken, clearSession } from "@/storage/authStorage";

/**
 * Attach JWT token to every request.
 */
async function attachAccessToken(config: InternalAxiosRequestConfig) {
  const token = await getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

/**
 * Handle authentication failures.
 */
async function handleResponseError(error: AxiosError) {
  if (error.response?.status === 401) {
    /**
     * Future:
     * Refresh access token here.
     */

    await clearSession();
  }

  return Promise.reject(error);
}

/**
 * Register interceptors.
 */
export function registerInterceptors() {
  apiClient.interceptors.request.use(attachAccessToken);

  authClient.interceptors.request.use(attachAccessToken);

  apiClient.interceptors.response.use(
    (response) => response,
    handleResponseError
  );

  authClient.interceptors.response.use(
    (response) => response,
    handleResponseError
  );
}
