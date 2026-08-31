import { AxiosError, InternalAxiosRequestConfig } from "axios";

import { apiClient, authClient } from "./client";

import { getAccessToken } from "@/storage/authStorage";

/**
 * ============================================================================
 * PUBLIC AUTH ENDPOINTS
 * ============================================================================
 *
 * These endpoints are called before authentication has been established.
 *
 * They must NOT receive an Authorization header.
 */
const PUBLIC_AUTH_ENDPOINTS = [
  "/StoreFront/Login",
  "/StoreFront/CreateUserStoreFront",
  "/StoreFront/VerifyUserEmail",
];

/**
 * ============================================================================
 * ATTACH ACCESS TOKEN
 * ============================================================================
 *
 * Adds the stored JWT to authenticated requests.
 */
async function attachAccessToken(config: InternalAxiosRequestConfig) {
  const requestUrl = config.url ?? "";

  /**
   * Check whether this is an endpoint that does not
   * require an Authorization header.
   */
  const isPublicAuthEndpoint = PUBLIC_AUTH_ENDPOINTS.some(
    (endpoint) => requestUrl === endpoint || requestUrl.endsWith(endpoint)
  );

  /**
   * --------------------------------------------------------------------------
   * PUBLIC AUTH REQUEST
   * --------------------------------------------------------------------------
   */
  if (isPublicAuthEndpoint) {
    console.log("=================================");
    console.log("AUTH INTERCEPTOR");
    console.log("PUBLIC AUTH REQUEST:", requestUrl);
    console.log("AUTHORIZATION: SKIPPED");
    console.log("=================================");

    return config;
  }

  /**
   * --------------------------------------------------------------------------
   * READ ACCESS TOKEN
   * --------------------------------------------------------------------------
   */
  const token = await getAccessToken();

  console.log("=================================");
  console.log("AUTH INTERCEPTOR");
  console.log("REQUEST:", requestUrl);
  console.log("BASE URL:", config.baseURL);
  console.log("HAS TOKEN:", !!token);

  console.log(
    "TOKEN PREVIEW:",
    token ? `${token.substring(0, 20)}...` : "NO TOKEN"
  );

  console.log("=================================");

  /**
   * --------------------------------------------------------------------------
   * ATTACH AUTHORIZATION HEADER
   * --------------------------------------------------------------------------
   */
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

/**
 * ============================================================================
 * HANDLE RESPONSE ERRORS
 * ============================================================================
 *
 * IMPORTANT:
 *
 * We are intentionally NOT clearing the session on 401 yet.
 *
 * We are currently determining whether the backend is rejecting:
 *
 * 1. The Authorization header
 * 2. The JWT itself
 * 3. The API/environment
 * 4. The authentication contract
 */
async function handleResponseError(error: AxiosError) {
  /**
   * --------------------------------------------------------------------------
   * AUTHENTICATION ERROR
   * --------------------------------------------------------------------------
   */
  if (error.response?.status === 401) {
    const requestUrl = error.config?.url ?? "";

    const baseUrl = error.config?.baseURL ?? "";

    const method = error.config?.method ?? "unknown";

    const authorizationHeader = error.config?.headers?.Authorization;

    console.log("=================================");
    console.log("AUTHENTICATION ERROR");
    console.log("=================================");

    console.log("METHOD:", method.toUpperCase());

    console.log("BASE URL:", baseUrl);

    console.log("REQUEST:", requestUrl);

    console.log("FULL URL:", `${baseUrl}${requestUrl}`);

    console.log("STATUS:", error.response.status);

    /**
     * We deliberately do not print
     * the actual JWT.
     */
    console.log(
      "REQUEST AUTH HEADER:",
      authorizationHeader ? "Bearer token present" : "NO AUTH HEADER"
    );

    console.log("RESPONSE DATA:", JSON.stringify(error.response.data, null, 2));

    console.log(
      "RESPONSE HEADERS:",
      JSON.stringify(error.response.headers, null, 2)
    );

    console.log("=================================");

    /**
     * ------------------------------------------------------------------------
     * DO NOT CLEAR SESSION
     * ------------------------------------------------------------------------
     *
     * The backend may be rejecting the token for reasons unrelated
     * to an expired session.
     *
     * We need to inspect the 401 first.
     */
  }

  return Promise.reject(error);
}

/**
 * ============================================================================
 * REGISTER INTERCEPTORS
 * ============================================================================
 */
export function registerInterceptors() {
  /**
   * API Gateway
   */
  apiClient.interceptors.request.use(attachAccessToken);

  /**
   * Authentication Server
   */
  authClient.interceptors.request.use(attachAccessToken);

  /**
   * API Gateway responses
   */
  apiClient.interceptors.response.use(
    (response) => response,
    handleResponseError
  );

  /**
   * Authentication Server responses
   */
  authClient.interceptors.response.use(
    (response) => response,
    handleResponseError
  );
}
