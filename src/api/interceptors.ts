import { AxiosError, InternalAxiosRequestConfig } from "axios";

import { apiClient, authClient } from "./client";

import { getAccessToken, clearSession } from "@/storage/authStorage";

/**
 * ---------------------------------------------------------------------------
 * Attach JWT Access Token
 * ---------------------------------------------------------------------------
 *
 * Adds the authenticated user's JWT to API requests.
 *
 * Login itself does not have a token yet, so the request is allowed to
 * continue without an Authorization header.
 */
async function attachAccessToken(config: InternalAxiosRequestConfig) {
  /**
   * Login requests do not require an existing JWT.
   * The login endpoint is responsible for issuing
   * the JWT after validating credentials.
   */
  if (config.url === "/StoreFront/Login") {
    return config;
  }

  const token = await getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

/**
 * ---------------------------------------------------------------------------
 * Handle Authentication Errors
 * ---------------------------------------------------------------------------
 */
async function handleResponseError(error: AxiosError) {
  if (error.response?.status === 401) {
    console.log("=================================");
    console.log("AUTHENTICATION ERROR");
    console.log("REQUEST:", error.config?.url);
    console.log("STATUS:", error.response.status);
    console.log("RESPONSE DATA:", JSON.stringify(error.response.data));
    console.log("=================================");

    await clearSession();
  }

  return Promise.reject(error);
}

/**
 * ---------------------------------------------------------------------------
 * Register Axios Interceptors
 * ---------------------------------------------------------------------------
 */
export function registerInterceptors() {
  /**
   * API Gateway
   */
  apiClient.interceptors.request.use(attachAccessToken);

  apiClient.interceptors.response.use(
    (response) => response,
    handleResponseError
  );

  /**
   * Authentication Server
   */
  authClient.interceptors.request.use(attachAccessToken);

  authClient.interceptors.response.use(
    (response) => response,
    handleResponseError
  );
}
