export const ROUTES = {
  /**
   * APP
   */

  SPLASH: "/",

  /**
   * ONBOARDING
   */

  WELCOME:
    "/(onboarding)/welcome",

  // STEP 1
  SIGNUP:
    "/(onboarding)/signup",

  EMAIL_VERIFICATION:
    "/(onboarding)/email-verification",

  // STEP 2
  BUSINESS_DETAILS:
    "/(onboarding)/business-details",

  // STEP 3
  ID_VERIFICATION:
    "/(onboarding)/id-verification",

  // STEP 4
  BIOMETRIC_VERIFICATION:
    "/(onboarding)/biometric-verification",

  /**
   * AUTH
   */

  LOGIN:
    "/(auth)/login",

  FORGOT_PASSWORD:
    "/(auth)/forgot-password",

  RESET_PASSWORD:
    "/(auth)/reset-password",

  /**
   * APP
   */

  TABS: "/(tabs)",

  HOME: "/(tabs)/home",

  PRODUCTS:
    "/(tabs)/products",

  ORDERS:
    "/(tabs)/orders",

  STORE:
    "/(tabs)/store",

  MORE:
    "/(tabs)/more",
} as const;