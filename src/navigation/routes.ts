export const ROUTES = {
  /**
   * APP
   */

  SPLASH: "/",

  /**
   * ONBOARDING
   */

  WELCOME: "/(onboarding)/welcome",

  // STEP 1
  SIGNUP: "/(onboarding)/signup",

  EMAIL_VERIFICATION: "/(onboarding)/email-verification",

  // STEP 2
  BUSINESS_DETAILS: "/(onboarding)/business-details",

  // STEP 3
  ID_VERIFICATION: "/(onboarding)/id-verification",

  // STEP 4
  BIOMETRIC_VERIFICATION: "/(onboarding)/biometric-verification",

  /**
   * AUTH
   */

  LOGIN: "/(auth)/login",

  /**
   * PASSWORD RECOVERY
   */

  // STEP 1
  FORGOT_PASSWORD: "/(password-recovery)/forgot-password",

  // STEP 2
  RESET_PASSWORD: "/(password-recovery)/reset-password",

  // STEP 3
  VERIFY_OTP: "/(password-recovery)/verify-otp",

  // STEP 4
  NEW_PASSWORD: "/(password-recovery)/new-password",

  /**
   * APP
   */

  TABS: "/(tabs)",

  HOME: "/(tabs)/home",

  PRODUCTS: "/(tabs)/products",

    /**
   * PRODUCTS
   */

  PRODUCT_DETAILS: "/product/[id]",

  // STEP 1
  ADD_PRODUCT_INFO: "/product/add/info",

  // STEP 2
  ADD_PRODUCT_PRICING: "/product/add/pricing",

  // STEP 3
  ADD_PRODUCT_VARIANTS: "/product/add/variants",

  // STEP 4
  ADD_PRODUCT_STOREFRONT: "/product/add/storefront",

  // STEP 5
  ADD_PRODUCT_REVIEW: "/product/add/review",

  ORDERS: "/(tabs)/orders",

  STORE: "/(tabs)/store",

  MORE: "/(tabs)/more",
} as const;
