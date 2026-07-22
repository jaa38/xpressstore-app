export const ROUTES = {
  /**
   * SPLASH
   */
  SPLASH: "/",

  /**
   * ONBOARDING
   */
  WELCOME: "/(onboarding)/welcome",

  // Step 1
  SIGNUP: "/(onboarding)/signup",
  EMAIL_VERIFICATION: "/(onboarding)/email-verification",

  // Step 2
  BUSINESS_DETAILS: "/(onboarding)/business-details",

  // Step 3
  ID_VERIFICATION: "/(onboarding)/id-verification",

  // Step 4
  BIOMETRIC_VERIFICATION: "/(onboarding)/biometric-verification",

  /**
   * AUTH
   */
  LOGIN: "/(auth)/login",

  /**
   * PASSWORD RECOVERY
   */

  // Step 1
  FORGOT_PASSWORD: "/(password-recovery)/forgot-password",

  // Step 2
  RESET_PASSWORD: "/(password-recovery)/reset-password",

  // Step 3
  VERIFY_OTP: "/(password-recovery)/verify-otp",

  // Step 4
  NEW_PASSWORD: "/(password-recovery)/new-password",

  /**
   * MAIN APP
   */
  TABS: "/(tabs)",

  HOME: "/(tabs)",

  STORE: "/(tabs)/store",

  ORDERS: "/(tabs)/orders",

  PRODUCTS: "/(tabs)/products",

  MORE: "/(tabs)/more",

  /**
   * MORE
   */
  PAYMENT_LINKS: "/(tabs)/more/payment-link",

  BUSINESS: "/(tabs)/more/business",

  SETTLEMENTS: "/(tabs)/more/settlements",

  CUSTOMERS: "/(tabs)/more/customers",

  SECURITY: "/(tabs)/more/security",

  NOTIFICATIONS: "/(tabs)/more/notifications",

  SETTINGS: "/(tabs)/more/settings",

  SUPPORT: "/(tabs)/more/support",

  ABOUT: "/(tabs)/more/about",

  /**
   * PRODUCTS
   */

  PRODUCT_DETAILS: "/product/[id]",

  // Step 1
  ADD_PRODUCT_INFO: "/product/add/info",

  // Step 2
  ADD_PRODUCT_PRICING: "/product/add/pricing",

  // Step 3
  ADD_PRODUCT_VARIANTS: "/product/add/variants",

  // Step 4
  ADD_PRODUCT_STOREFRONT: "/product/add/storefront",

  // Step 5
  ADD_PRODUCT_REVIEW: "/product/add/review",
} as const;

export const getProductDetailsRoute = (id: string) => `/product/${id}` as const;
