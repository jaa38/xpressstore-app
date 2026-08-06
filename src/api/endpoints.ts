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

    byStore: (storeId: number) => `/Product/GetProductsByStore/${storeId}`,

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
    uploadImage: "/FileUploader/UploadProductImage",

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
   * Payment Pages
   * ---------------------------------------------------------------------------
   */
  paymentPages: {
    /**
     * CRUD
     */
    list: "/PaymentPages/GetPaymentPages",

    details: (id: number) => `/PaymentPages/GetPaymentPageById/${id}`,

    create: "/PaymentPages/CreatePaymentPage",

    update: "/PaymentPages/UpdatePaymentPage",

    delete: (id: number) => `/PaymentPages/DeletePaymentPage/${id}`,

    /**
     * Validation
     */
    validateReference: (reference: string) =>
      `/PaymentPages/ValidatePaymentReference/${reference}`,

    /**
     * Transactions
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
