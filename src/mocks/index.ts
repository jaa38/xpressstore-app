export {
  USE_MOCK_PRODUCTS,
  USE_MOCK_CATEGORIES,
  USE_MOCK_CUSTOMERS,
  USE_MOCK_PAYMENT_LINKS,
  USE_MOCK_ORDERS,
  USE_MOCK_STORES,
  USE_MOCK_TRANSACTIONS,
  USE_MOCK_DISCOUNTS,
} from "./config";

export {
  MOCK_CATEGORIES,
  getMockCategories,
  getMockCategoryById,
  createMockCategory,
  updateMockCategory,
  deleteMockCategory,
} from "./categories";

export { MOCK_ORDERS, getMockOrders, getMockOrderById } from "./orders";

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
