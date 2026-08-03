export const ENV = {
  /**
   * App
   */
  APP_NAME: "XpressStore",

  ENVIRONMENT: "development",

  /**
   * Xpress API
   */
  API_BASE_URL:
    "https://api.xpresspayments.com",

  API_VERSION: "v1",

  API_TIMEOUT: 30000,

  /**
   * GraphQL
   */
  GRAPHQL_ENDPOINT:
    "https://api.xpresspayments.com/graphql",

  /**
   * Authentication
   */
  TOKEN_STORAGE_KEY: "xpress_access_token",

  REFRESH_TOKEN_STORAGE_KEY:
    "xpress_refresh_token",

  USER_STORAGE_KEY: "xpress_user",

  /**
   * Feature Flags
   */
  ENABLE_API_LOGGING: true,

  ENABLE_NETWORK_LOGGING: true,
} as const;