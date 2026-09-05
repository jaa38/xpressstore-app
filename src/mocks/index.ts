/**
 * ============================================================================
 * MOCK EXPORTS
 * ============================================================================
 */

/**
 * ---------------------------------------------------------------------------
 * Mock Configuration
 * ---------------------------------------------------------------------------
 */

export {
  USE_MOCK_AUTH,
  USE_MOCK_PRODUCTS,
  USE_MOCK_CATEGORIES,
  USE_MOCK_CUSTOMERS,
  USE_MOCK_PAYMENT_LINKS,
  USE_MOCK_ORDERS,
  USE_MOCK_STORES,
  USE_MOCK_TRANSACTIONS,
  USE_MOCK_DISCOUNTS,
  USE_MOCK_ONBOARDING,
  USE_MOCK_EMAIL_VERIFICATION,
  USE_MOCK_BVN,
  USE_MOCK_KYC,
  USE_MOCK_DOCUMENT_UPLOAD,
  USE_MOCK_BUSINESS_CATEGORIES,
  USE_MOCK_DASHBOARD,
  USE_MOCK_SETTLEMENT_ACCOUNTS,
} from "./config";

/**
 * ---------------------------------------------------------------------------
 * Authentication
 * ---------------------------------------------------------------------------
 */

export {
  MOCK_VERIFICATION_OTP,
  MOCK_PASSWORD_RESET_OTP,
  registerMockUser,
  loginMockUser,
  verifyMockEmailOtp,
  resendMockOtp,
  updateMockPassword,
  forgotMockPassword,
  verifyMockPasswordResetOtp,
  resetMockPassword,
  getMockAuthAccount,
} from "./auth";

/**
 * ---------------------------------------------------------------------------
 * Product Categories
 * ---------------------------------------------------------------------------
 */

export {
  MOCK_CATEGORIES,
  getMockCategories,
  getMockCategoryById,
  createMockCategory,
  updateMockCategory,
  deleteMockCategory,
} from "./categories";

/**
 * ---------------------------------------------------------------------------
 * Orders
 * ---------------------------------------------------------------------------
 */

export { MOCK_ORDERS, getMockOrders, getMockOrderById } from "./orders";

/**
 * ---------------------------------------------------------------------------
 * Stores
 * ---------------------------------------------------------------------------
 */

export {
  MOCK_STORES,
  getMockStores,
  getMockStore,
  getMockStoreSummaries,
  createMockStore,
  updateMockStore,
  deleteMockStore,
  resetMockStores,
  addMockProductToStore,
  removeMockProductFromStore,
  addMockDiscountToStore,
  removeMockDiscountFromStore,
  setMockStoreDiscounts,
  updateMockStoreLayout,
  getMockShippingRegions,
  saveMockShippingRegions,
  createMockShippingRegion,
  updateMockShippingRegion,
  deleteMockShippingRegion,
  resetMockShippingRegions,
  validateMockStoreName,
  validateMockStoreReference,
} from "./stores";

/**
 * ---------------------------------------------------------------------------
 * Discounts
 * ---------------------------------------------------------------------------
 */

export {
  MOCK_DISCOUNTS,
  getMockDiscounts,
  getMockDiscountById,
  createMockDiscount,
  updateMockDiscount,
  updateMockDiscountStatus,
  deleteMockDiscount,
  resetMockDiscounts,
} from "./discounts";

/**
 * ---------------------------------------------------------------------------
 * Onboarding / KYC
 * ---------------------------------------------------------------------------
 */

export {
  MOCK_KYC_TIERS,
  MOCK_KYC_REQUIREMENTS,
  updateMockBusinessDetails,
  updateMockBusinessType,
  getMockKycTiers,
  getMockKycRequirements,
  verifyMockBVN,
  uploadMockDocument,
  createMockMerchantKyc,
} from "./onboarding";

/**
 * ---------------------------------------------------------------------------
 * Business Categories
 * ---------------------------------------------------------------------------
 */

export {
  MOCK_BUSINESS_CATEGORIES,
  getMockBusinessCategories,
} from "./businessCategories";

/**
 * ---------------------------------------------------------------------------
 * Dashboard
 * ---------------------------------------------------------------------------
 */

export {
  getMockDashboard,
  updateMockDashboardBusinessName,
  resetMockDashboard,
} from "./dashboard";

/**
 * ---------------------------------------------------------------------------
 * Settlement Accounts
 * ---------------------------------------------------------------------------
 */

export {
  getMockSettlementAccounts,
  validateMockSettlementAccount,
  updateMockSettlementAccount,
  deleteMockSettlementAccount,
  resetMockSettlementAccounts,
} from "./settlementAccounts";
