import {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import {
  apiClient,
  authClient,
} from "./client";

import {
  getAccessToken,
  clearSession,
} from "@/storage/authStorage";

/**
 * Endpoints that must not receive
 * an Authorization header.
 *
 * These endpoints are used before
 * authentication has been established.
 */
const PUBLIC_AUTH_ENDPOINTS = [
  "/StoreFront/Login",
  "/StoreFront/CreateUserStoreFront",
  "/StoreFront/VerifyUserEmail",
];

/**
 * Attach JWT token to authenticated requests.
 */
async function attachAccessToken(
  config: InternalAxiosRequestConfig
) {
  const requestUrl = config.url ?? "";

  const isPublicAuthEndpoint =
    PUBLIC_AUTH_ENDPOINTS.some(
      (endpoint) =>
        requestUrl === endpoint ||
        requestUrl.endsWith(endpoint)
    );

  if (isPublicAuthEndpoint) {
    console.log("=================================");
    console.log("AUTH INTERCEPTOR");
    console.log("PUBLIC AUTH REQUEST:", requestUrl);
    console.log("AUTHORIZATION: SKIPPED");
    console.log("=================================");

    return config;
  }

  const token = await getAccessToken();

  console.log("=================================");
  console.log("AUTH INTERCEPTOR");
  console.log("REQUEST:", requestUrl);
  console.log("BASE URL:", config.baseURL);
  console.log("HAS TOKEN:", !!token);
  console.log(
    "TOKEN PREVIEW:",
    token
      ? `${token.substring(0, 20)}...`
      : "NO TOKEN"
  );
  console.log("=================================");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
}

/**
 * Handle authentication failures.
 */
async function handleResponseError(
  error: AxiosError
) {
  if (error.response?.status === 401) {
    console.log("=================================");
    console.log("AUTHENTICATION ERROR");
    console.log(
      "REQUEST:",
      error.config?.url
    );
    console.log(
      "STATUS:",
      error.response.status
    );
    console.log(
      "RESPONSE DATA:",
      JSON.stringify(
        error.response.data,
        null,
        2
      )
    );
    console.log("=================================");

    /**
     * Do not immediately clear the session
     * for a failed login request.
     */
    const requestUrl =
      error.config?.url ?? "";

    const isLoginRequest =
      requestUrl.endsWith(
        "/StoreFront/Login"
      );

    if (!isLoginRequest) {
      await clearSession();
    }
  }

  return Promise.reject(error);
}

/**
 * Register interceptors.
 */
export function registerInterceptors() {
  apiClient.interceptors.request.use(
    attachAccessToken
  );

  authClient.interceptors.request.use(
    attachAccessToken
  );

  apiClient.interceptors.response.use(
    (response) => response,
    handleResponseError
  );

  authClient.interceptors.response.use(
    (response) => response,
    handleResponseError
  );
}