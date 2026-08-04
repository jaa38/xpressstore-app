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
    merchant: "/Product/GetMerchantProducts",

    byStore: (storeId: string) => `/Product/stores/${storeId}`,

    create: "/Product/CreateProduct",

    update: "/Product/UpdateProduct",

    delete: (productId: string) => `/Product/DeleteProduct/${productId}`,
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
    list: "/PaymentPages/GetPaymentPages",

    create: "/PaymentPages/CreatePaymentPage",

    update: "/PaymentPages/UpdatePaymentPage",

    delete: (id: string) => `/PaymentPages/DeletePaymentPage/${id}`,
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
