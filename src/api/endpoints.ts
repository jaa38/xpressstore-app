export const API_ENDPOINTS = {
  /**
   * ---------------------------------------------------------------------------
   * Authentication (Auth Base URL)
   * ---------------------------------------------------------------------------
   */
  auth: {
    login: "/StoreFront/Login",

    register: "/StoreFront/CreateUserStoreFront",

    verifyEmail: "/StoreFront/VerifyUserEmail",

    resendOtp: "/StoreFront/UpdateUserEmailVerification",

    forgotPassword: "/StoreFront/ForgotPassword",

    changePassword: "/StoreFront/ChangePassword",

    fetchUser: "/StoreFront/GetUser",

    updateBusinessDetails: "/StoreFront/UpdateMerchantBusinessDetails",

    updateBusinessType: "/StoreFront/UpdateMerchantBusinessType",

    verifyPasswordResetOtp: "/api/v2/Account/VerifyForgetPasswordOTP",
  },

  /**
   * ---------------------------------------------------------------------------
   * KYC
   * ---------------------------------------------------------------------------
   */
  kyc: {
    tiers: "/kycTiers/GetAllkycTiers",

    requirements: "/KycTiers/GetKycRequirementByKycTier",

    create: "/MerchantKyc/CreateMerchantKyc",

    createStorefront: "/StoreFront/CreateMerchantKycStoreFront",

    merchant: "/MerchantKyc/GetMerchantKycAll",

    uploadDocument: "/FileUploader/UploadDocument",

    verifyBVN: "/Validator/GetBVNDetails",

    businessDetails: "/Validator/GetBusinessDetails",
  },

  /**
   * ---------------------------------------------------------------------------
   * Dashboard
   * ---------------------------------------------------------------------------
   */
  dashboard: {
    summary: "/Store/dashboard",
  },

  /**
   * ---------------------------------------------------------------------------
   * Stores
   * ---------------------------------------------------------------------------
   */
  stores: {
    list: "/Store/GetStores",

    details: (storeId: string) => `/Store/GetStoreById/${storeId}`,

    create: "/Store/CreateStore",

    update: "/Store/UpdateStore",

    delete: (storeId: string) => `/Store/DeleteStore/${storeId}`,
  },

  /**
   * ---------------------------------------------------------------------------
   * Products
   * ---------------------------------------------------------------------------
   */
  products: {
    /**
     * Merchant Products
     */
    merchant: "/Product/GetMerchantProducts",

    product: (productId: number) => `/Product/GetProductById/${productId}`,

    byStore: (storeId: number) => `/Product/stores/${storeId}`,

    /**
     * CRUD
     */
    create: "/Product/CreateProduct",

    update: "/Product/UpdateProduct",

    delete: (productId: number) => `/Product/DeleteProduct/${productId}`,

    /**
     * Status
     */
    toggleStatus: (productId: number, status: boolean) =>
      `/Product/ToggleProduct/${productId}/${status}`,

    /**
     * Images
     */
    uploadImage: "/Product/UploadProductImages",

    /**
     * Store Assignment
     */
    addToStore: "/Product/AddProductToStores",

    /**
     * Categories
     */
    categories: "/Product/GetAllProductCategory",

    createCategory: "/Product/CreateProductCategory",

    updateCategory: "/Product/UpdateProductCategory",

    deleteCategory: (categoryId: number) =>
      `/Product/DeleteProductCategory/${categoryId}`,
  },

  /**
   * ---------------------------------------------------------------------------
   * Invoices
   * ---------------------------------------------------------------------------
   */
  invoices: {
    merchant: "/Invoices/GetMerchantInvoice",

    create: "/Invoices/CreateInvoice",
  },

  /**
   * ---------------------------------------------------------------------------
   * Payment Pages / Payment Links
   * ---------------------------------------------------------------------------
   *
   * Backend documentation:
   * 09_payment_pages.md
   *
   * Payment Pages use the API Gateway Base URL.
   *
   * Base URL:
   * https://api.myxpresspay.com/api/
   * ---------------------------------------------------------------------------
   */
  paymentPages: {
    /**
     * -------------------------------------------------------------------------
     * Get All Payment Pages
     * -------------------------------------------------------------------------
     *
     * GET /PaymentPages/GetAllPages
     */
    list: "/PaymentPages/GetAllPages",

    /**
     * -------------------------------------------------------------------------
     * Get Payment Page By Reference
     * -------------------------------------------------------------------------
     *
     * GET /PaymentPages/GetAllPages/{merchantId}/{reference}
     */
    byReference: (merchantId: string, reference: string) =>
      `/PaymentPages/GetAllPages/${merchantId}/${reference}`,

    /**
     * -------------------------------------------------------------------------
     * Add Payment Page
     * -------------------------------------------------------------------------
     *
     * POST /PaymentPages/Add
     */
    create: "/PaymentPages/Add",

    /**
     * -------------------------------------------------------------------------
     * Update Payment Page
     * -------------------------------------------------------------------------
     *
     * POST /PaymentPages/Update
     */
    update: "/PaymentPages/Update",

    /**
     * -------------------------------------------------------------------------
     * Validate Payment Page Reference
     * -------------------------------------------------------------------------
     *
     * GET /PaymentPages/ValidatePaymentPageLinkRefernce/{reference}
     *
     * "Refernce" is intentionally preserved because this is the
     * endpoint spelling documented by the backend.
     */
    validateReference: (reference: string) =>
      `/PaymentPages/ValidatePaymentPageLinkRefernce/${reference}`,

    /**
     * -------------------------------------------------------------------------
     * Payment Page Transactions
     * -------------------------------------------------------------------------
     *
     * GET /PaymentPages/GetPaymentPageTransactions/{paymentPageId}
     */
    transactions: (paymentPageId: number) =>
      `/PaymentPages/GetPaymentPageTransactions/${paymentPageId}`,
  },

  /**
   * ---------------------------------------------------------------------------
   * Merchant Profile
   * ---------------------------------------------------------------------------
   */
  merchants: {
    settlementAccounts: "/Merchants/GetSettlementAccounts",

    updateSettlementAccount: "/Merchants/UpdateSettlementAccount",

    deleteSettlementAccount: (settlementId: string) =>
      `/Merchants/DeleteSettlementAccount/${settlementId}`,

    paymentMethods: "/Merchants/payment-methods",

    updatePaymentMethod: "/Merchants/UpdatePaymentMethod",

    registerPushNotification: "/Merchants/RegisterPushNotification",
  },

  /**
   * ---------------------------------------------------------------------------
   * Lookup
   * ---------------------------------------------------------------------------
   */
  lookup: {
    /**
     * Business Categories
     */
    businessCategories: "/BusinessCategory/GetBusinessCategories",

    /**
     * Business Types
     */
    businessTypes: "/Industry/GetBusinessTypes",

    /**
     * Industries
     */
    industries: "/Industry/GetIndustries",

    /**
     * Industry Categories
     */
    industryCategories: (industryId: number) =>
      `/Industry/GetIndustryCategories?IndustryId=${industryId}`,
  },

  /**
   * ---------------------------------------------------------------------------
   * Store
   * ---------------------------------------------------------------------------
   */
  store: {
    getStores: "/Store/GetStores",

    getStore: (storeId: number) => `/Store/GetStoreById/${storeId}`,

    createStore: "/Store/CreateStore",

    updateStore: "/Store/UpdateStore",

    deleteStore: (storeId: number) => `/Store/DeleteStore/${storeId}`,

    validateStoreName: (storeName: string) =>
      `/Store/ValidateStoreName/${storeName}`,

    validateStoreReference: (reference: string) =>
      `/Store/ValidateStoreReference/${reference}`,

    getShippingRegions: "/Store/GetAllMerchantShippingRegions",

    createShippingRegion: "/Store/CreateShippingRegion",

    updateShippingRegion: "/Store/UpdateShippingRegion",

    deleteShippingRegion: (regionId: number) =>
      `/Store/DeleteShippingRegion/${regionId}`,

    toggleDelivery: (transactionId: string, isDelivery: boolean) =>
      `/Store/ToggleDelivery?IsDelivery=${isDelivery}&TransactionId=${transactionId}`,
  },

  /**
   * ---------------------------------------------------------------------------
   * Customers
   * ---------------------------------------------------------------------------
   */
  customers: {
    getAll: "/Invoices/GetCustomer",

    create: "/Invoices/CreateCustomer",

    update: "/Invoices/UpdateCustomer",

    blacklist: (customerId: number, isBlackListed: boolean) =>
      `/Invoices/BlackListCustomer/${customerId}?IsBlackListed=${isBlackListed}`,
  },

  /**
   * ---------------------------------------------------------------------------
   * GraphQL
   * ---------------------------------------------------------------------------
   */
  graphql: {
    transactions: "storeTransactions",

    transactionSummary: "storeTransactionSummarry",

    payments: "transactions",

    paymentSummary: "transactionSummarry",
  },
} as const;
