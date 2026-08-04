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

  DOCUMENT_UPLOAD: "/(onboarding)/document-upload",

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

  ORDER_DETAILS: "/orders/[id]",

  PRODUCTS: "/(tabs)/products",

  MORE: "/(tabs)/more",

  /**
   * MORE
   */
  PAYMENT_LINKS: "/(tabs)/more/payment-link",

  BUSINESS: "/(tabs)/more/business",

  PAYMENT_SETTINGS: "/(tabs)/more/payment-settings",

  TRANSACTIONS: "/(tabs)/more/transactions",

  TRANSACTION_DETAILS: "/transactions/[id]",

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

  /**
   * PAYMENT LINKS
   */

  // Create Payment Link
  ADD_PAYMENT_LINK_INFORMATION: "/payment-link/add/information",

  ADD_PAYMENT_LINK_SETTINGS: "/payment-link/add/settings",

  ADD_PAYMENT_LINK_REVIEW: "/payment-link/add/review",

  // QR Code
  PAYMENT_LINK_QR_CODE: "/(tabs)/more/payment-link/qr-code",

  /**
   * CUSTOMERS
   */

  // Create a Customer
  ADD_CUSTOMER: "/customers/add/information",

  CUSTOMER_DETAILS: "/more/customers/view/[id]",

  ADD_CUSTOMER_INFORMATION: "/customers/add/information",
  ADD_CUSTOMER_ADDRESS: "/customers/add/address",
} as const;

export const getProductDetailsRoute = (id: string) => `/product/${id}` as const;

export const getCustomerDetailsRoute = (id: string) =>
  `/more/customers/view/${id}` as const;

export const getTransactionDetailsRoute = (id: string) =>
  `/transactions/${id}` as const;

export const getOrderDetailsRoute = (id: string) => `/orders/${id}` as const;
