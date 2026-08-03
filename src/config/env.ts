export const ENV = {
  APP_NAME: "XpressStore",

  ENVIRONMENT: "development",

  /**
   * Authentication Server
   */
  AUTH_BASE_URL: "https://sso.xpresspayments.com:2503/api/v2/",

  /**
   * API Gateway
   */
  API_BASE_URL: "https://api.myxpresspay.com/api/",

  /**
   * GraphQL
   */
  GRAPHQL_ENDPOINT: "https://myxpresspay.com:7015/",

  API_TIMEOUT: 30000,

  TOKEN_STORAGE_KEY: "xpress_access_token",

  REFRESH_TOKEN_STORAGE_KEY: "xpress_refresh_token",

  USER_STORAGE_KEY: "xpress_user",

  ENABLE_API_LOGGING: true,

  ENABLE_NETWORK_LOGGING: true,
} as const;
