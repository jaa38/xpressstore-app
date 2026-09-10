export const ROUTES = {
  /**
   * SPLASH
   */
  SPLASH: "/",

  /**
   * ONBOARDING
   */

  // Welcome
  WELCOME: "/(onboarding)/welcome",

  // Step 1
  SIGNUP: "/(onboarding)/signup",
  EMAIL_VERIFICATION: "/(onboarding)/email-verification",

  // Step 2
  PASSWORD: "/(onboarding)/password",

  // Step 3
  BUSINESS_DETAILS: "/(onboarding)/business-details",

  // Step 4
  ID_VERIFICATION: "/(onboarding)/id-verification",

  // Step 5
  DOCUMENT_UPLOAD: "/(onboarding)/document-upload",

  // Step 6
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

  /**
   * STOREFRONT
   */

  // Storefront list
  STORE: "/(tabs)/store",

  // Storefront details
  STORE_DETAILS: "/stores/view/[id]",

  // Edit storefront information
  STORE_EDIT: "/stores/view/edit/[id]",

  // Storefront theme
  STORE_THEME: "/stores/view/theme/[id]",

  // Create Store - Step 1
  ADD_STORE_INFORMATION: "/stores/add/information",

  // Create Store - Step 2
  ADD_STORE_STOREFRONT: "/stores/add/storefront",

  // Create Store - Step 3
  ADD_STORE_SETTINGS: "/stores/add/settings",

  // Step 4
  ADD_STORE_REVIEW: "/stores/add/review",

  /**
   * ORDERS
   */

  ORDERS: "/(tabs)/orders",

  ORDER_DETAILS: "/orders/[id]",

  /**
   * PRODUCTS
   */

  PRODUCTS: "/(tabs)/products",

  MORE: "/(tabs)/more",

  /**
   * MORE
   */

  PAYMENT_LINKS: "/(tabs)/more/payment-link",

  BUSINESS: "/(tabs)/more/business",

  EDIT_BUSINESS: "/business/edit",

  CATEGORIES: "/(tabs)/more/categories",

  /**
   * DISCOUNT CODES
   */

  DISCOUNT_CODES: "/(tabs)/more/discount-codes",

  ADD_DISCOUNT_CODE: "/discount-codes/add",

  DISCOUNT_CODE_DETAILS: "/discount-codes/view/[id]",

  DISCOUNT_CODE_EDIT: "/discount-codes/edit/[id]",

  PAYMENT_SETTINGS: "/(tabs)/more/payment-settings",

  TRANSACTIONS: "/(tabs)/more/transactions",

  TRANSACTION_DETAILS: "/transactions/[id]",

  SETTLEMENTS: "/(tabs)/more/settlements",

  CUSTOMERS: "/(tabs)/more/customers",

  SECURITY: "/(tabs)/more/security",

  /**
   * SECURITY
   */

  CHANGE_PASSWORD: "/security/password",

  BIOMETRIC_AUTHENTICATION: "/security/additional-security/biometric",

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

  // Step 1
  ADD_PAYMENT_LINK_INFORMATION: "/payment-link/add/information",

  // Step 2
  ADD_PAYMENT_LINK_SETTINGS: "/payment-link/add/settings",

  // Step 3
  ADD_PAYMENT_LINK_REVIEW: "/payment-link/add/review",

  // QR Code
  PAYMENT_LINK_QR_CODE: "/(tabs)/more/payment-link/qr-code",

  /**
   * CATEGORIES
   */

  // Add Category
  ADD_CATEGORY: "/categories/add",

  /**
   * CUSTOMERS
   */

  // Create Customer - Step 1
  ADD_CUSTOMER: "/customers/add/information",

  CUSTOMER_DETAILS: "/more/customers/view/[id]",

  // Create Customer
  ADD_CUSTOMER_INFORMATION: "/customers/add/information",

  // Create Customer - Step 2
  ADD_CUSTOMER_ADDRESS: "/customers/add/address",

  /**
   * SHIPPING REGION
   */

  SHIPPING_REGION: "/(tabs)/more/shipping-region",

  ADD_SHIPPING_REGION: "/shipping-regions/add",

  SHIPPING_REGION_DETAILS: "/shipping-regions/view/[id]",

  EDIT_SHIPPING_REGION: "/shipping-regions/edit/[id]",
} as const;

/**
 * ============================================================================
 * ROUTE HELPERS
 * ============================================================================
 */

/**
 * Product Details
 */
export const getProductDetailsRoute = (id: string) => `/product/${id}` as const;

/**
 * Customer Details
 */
export const getCustomerDetailsRoute = (id: string) =>
  `/more/customers/view/${id}` as const;

/**
 * Transaction Details
 */
export const getTransactionDetailsRoute = (id: string) =>
  `/transactions/${id}` as const;

/**
 * Order Details
 */
export const getOrderDetailsRoute = (id: string) => `/orders/${id}` as const;

/**
 * Store Details
 */
export const getStoreDetailsRoute = (id: number | string) =>
  `/stores/view/${id}` as const;

/**
 * Store Edit
 */
export const getStoreEditRoute = (id: number | string) =>
  `/stores/view/edit/${id}` as const;

/**
 * Store Theme
 */
export const getStoreThemeRoute = (id: number | string) =>
  `/stores/view/theme/${id}` as const;

/**
 * Store Layout
 */
export const getStoreLayoutRoute = (id: number | string) =>
  `/stores/view/layout/${id}` as const;

/**
 * Store Products
 */
export const getStoreProductsRoute = (id: number | string) =>
  `/stores/view/products/${id}` as const;

/**
 * ============================================================================
 * SHIPPING REGION ROUTE HELPERS
 * ============================================================================
 */

export const getShippingRegionDetailsRoute = (id: number | string) =>
  `/shipping-regions/view/${id}` as const;

export const getEditShippingRegionRoute = (id: number | string) =>
  `/shipping-regions/edit/${id}` as const;
