import type {
  PaymentLink,
  PaymentLinkTransaction,
  CreatePaymentLinkRequest,
  UpdatePaymentLinkRequest,
} from "@/types/paymentLink";

/**
 * ============================================================================
 * MOCK PAYMENT LINKS
 * ============================================================================
 */

export const MOCK_PAYMENT_LINKS: PaymentLink[] = [
  {
    id: 1,

    name: "Nike Air Max",

    description: "Payment for Nike Air Max sneakers",

    amount: 185000,

    currency: "NGN",

    pageType: "single",

    paymentLinkReference: "nike-air-max",

    paymentLink: "https://payx.press/nike-air-max",

    isActive: true,

    isFixedAmount: true,

    isPhoneNumberRequired: true,

    isTestMode: false,

    createdAt: "2026-08-10T09:00:00.000Z",

    updatedAt: "2026-08-19T12:30:00.000Z",
  },

  {
    id: 2,

    name: "Premium T-Shirt",

    description: "Premium cotton T-shirt",

    amount: 45000,

    currency: "NGN",

    pageType: "single",

    paymentLinkReference: "premium-tshirt",

    paymentLink: "https://payx.press/premium-tshirt",

    isActive: true,

    isFixedAmount: true,

    isPhoneNumberRequired: true,

    isTestMode: false,

    createdAt: "2026-08-11T10:30:00.000Z",

    updatedAt: "2026-08-20T10:15:00.000Z",
  },

  {
    id: 3,

    name: "Home Decor Package",

    description: "Modern home decor package",

    amount: 97500,

    currency: "NGN",

    pageType: "single",

    paymentLinkReference: "home-decor",

    paymentLink: "https://payx.press/home-decor",

    isActive: true,

    isFixedAmount: true,

    isPhoneNumberRequired: false,

    isTestMode: false,

    createdAt: "2026-08-12T08:45:00.000Z",

    updatedAt: "2026-08-19T15:45:00.000Z",
  },

  {
    id: 4,

    name: "Community Donation",

    description: "Support our community initiative",

    amount: 25000,

    currency: "NGN",

    pageType: "donation",

    paymentLinkReference: "community-donation",

    paymentLink: "https://payx.press/community-donation",

    isActive: true,

    isFixedAmount: false,

    isPhoneNumberRequired: true,

    isTestMode: false,

    createdAt: "2026-08-13T11:20:00.000Z",

    updatedAt: "2026-08-18T09:20:00.000Z",
  },

  {
    id: 5,

    name: "Old Product Link",

    description: "Previous product payment page",

    amount: 65000,

    currency: "NGN",

    pageType: "single",

    paymentLinkReference: "old-product",

    paymentLink: "https://payx.press/old-product",

    isActive: false,

    isFixedAmount: true,

    isPhoneNumberRequired: false,

    isTestMode: false,

    createdAt: "2026-07-20T13:00:00.000Z",

    updatedAt: "2026-08-01T09:00:00.000Z",
  },

  {
    id: 6,

    name: "Wireless Headphones",

    description: "Premium wireless headphones",

    amount: 85000,

    currency: "NGN",

    pageType: "single",

    paymentLinkReference: "wireless-headphones",

    paymentLink: "https://payx.press/wireless-headphones",

    isActive: true,

    isFixedAmount: true,

    isPhoneNumberRequired: true,

    isTestMode: false,

    createdAt: "2026-08-14T14:00:00.000Z",

    updatedAt: "2026-08-20T16:10:00.000Z",
  },
];

/**
 * ============================================================================
 * MOCK PAYMENT LINK TRANSACTIONS
 * ============================================================================
 */

export const MOCK_TRANSACTIONS_BY_PAYMENT_LINK_ID = new Map<
  number,
  PaymentLinkTransaction[]
>([
  [
    1,
    [
      {
        transactionId: "TXN-NIKE-001",

        amount: 185000,

        status: "successful",

        dateCreated: "2026-08-19T12:30:00.000Z",
      },
    ],
  ],

  [
    2,
    [
      {
        transactionId: "TXN-TSHIRT-001",

        amount: 45000,

        status: "pending",

        dateCreated: "2026-08-20T10:15:00.000Z",
      },
    ],
  ],

  [
    3,
    [
      {
        transactionId: "TXN-HOME-001",

        amount: 97500,

        status: "failed",

        dateCreated: "2026-08-19T15:45:00.000Z",
      },
    ],
  ],

  [
    4,
    [
      {
        transactionId: "TXN-DONATION-001",

        amount: 25000,

        status: "successful",

        dateCreated: "2026-08-18T09:20:00.000Z",
      },
    ],
  ],

  [5, []],

  [
    6,
    [
      {
        transactionId: "TXN-HEADPHONES-001",

        amount: 85000,

        status: "successful",

        dateCreated: "2026-08-20T16:10:00.000Z",
      },
    ],
  ],
]);

/**
 * ============================================================================
 * MOCK PAYMENT LINK HELPERS
 * ============================================================================
 */

/**
 * Get all mock payment links.
 *
 * Returns a new array so callers cannot accidentally replace
 * the mock data array itself.
 */
export function getMockPaymentLinks(): PaymentLink[] {
  return [...MOCK_PAYMENT_LINKS];
}

/**
 * Get a payment link by ID.
 */
export function getMockPaymentLinkById(id: number): PaymentLink | undefined {
  return MOCK_PAYMENT_LINKS.find((link) => link.id === id);
}

/**
 * Get transactions for a payment link.
 */
export function getMockPaymentLinkTransactions(
  paymentLinkId: number
): PaymentLinkTransaction[] {
  return [...(MOCK_TRANSACTIONS_BY_PAYMENT_LINK_ID.get(paymentLinkId) ?? [])];
}

/**
 * Get the complete transaction map.
 */
export function getMockPaymentLinkTransactionMap() {
  return new Map(
    Array.from(MOCK_TRANSACTIONS_BY_PAYMENT_LINK_ID.entries()).map(
      ([id, transactions]) => [id, [...transactions]]
    )
  );
}

/**
 * ============================================================================
 * MOCK PAYMENT LINK VALIDATION
 * ============================================================================
 */

/**
 * Check whether a payment link reference is available.
 *
 * Mirrors:
 *
 * GET /PaymentPages/ValidatePaymentPageLinkRefernce/{reference}
 */
export async function validateMockPaymentLinkReference(reference: string) {
  const normalizedReference = reference.trim().toLowerCase();

  const exists = MOCK_PAYMENT_LINKS.some(
    (link) =>
      link.paymentLinkReference.trim().toLowerCase() === normalizedReference
  );

  return {
    responseCode: "00",

    responseMessage: "Payment link reference validated.",

    data: {
      isAvailable: !exists,
    },
  };
}

/**
 * ============================================================================
 * MOCK CREATE PAYMENT LINK
 * ============================================================================
 */

/**
 * Create a payment link in local mock storage.
 *
 * Mirrors:
 *
 * POST /PaymentPages/Add
 */
export async function createMockPaymentLink(payload: CreatePaymentLinkRequest) {
  const nextId =
    MOCK_PAYMENT_LINKS.length > 0
      ? Math.max(...MOCK_PAYMENT_LINKS.map((link) => link.id)) + 1
      : 1;

  const now = new Date().toISOString();

  const paymentLink: PaymentLink = {
    id: nextId,

    name: payload.name,

    description: payload.description,

    amount: Number(payload.amount ?? 0),

    currency: payload.currency,

    pageType: payload.pageType,

    paymentLinkReference: payload.paymentLinkReference,

    paymentLink: `https://payx.press/${payload.paymentLinkReference}`,

    isActive: true,

    isFixedAmount: payload.isFixedAmount ?? true,

    redirectUrl: payload.redirectUrl,

    isPhoneNumberRequired: payload.isPhoneNumberRequired ?? false,

    isTestMode: payload.isTestMode ?? false,

    subAccountId: payload.subAccountId,

    subAccountGroupId: payload.subAccountGroupId,

    extraFields: payload.extraFields,

    createdAt: now,

    updatedAt: now,
  };

  MOCK_PAYMENT_LINKS.push(paymentLink);

  /**
   * The real API returns data: null
   * after successful creation.
   */
  return {
    responseCode: "00",

    responseMessage: "Payment page created",

    data: null,
  };
}

/**
 * ============================================================================
 * MOCK UPDATE PAYMENT LINK
 * ============================================================================
 */

/**
 * Update a payment link in local mock storage.
 *
 * Mirrors:
 *
 * POST /PaymentPages/Update
 */
export async function updateMockPaymentLink(payload: UpdatePaymentLinkRequest) {
  const index = MOCK_PAYMENT_LINKS.findIndex((link) => link.id === payload.id);

  if (index === -1) {
    throw new Error("Payment link not found.");
  }

  // TypeScript does not guarantee that an array element exists
  // after findIndex(), so explicitly narrow it here.
  const existing = MOCK_PAYMENT_LINKS[index];

  if (!existing) {
    throw new Error("Payment link not found.");
  }

  MOCK_PAYMENT_LINKS[index] = {
    ...existing,

    name: payload.name,

    description: payload.description,

    amount:
      payload.amount !== undefined ? Number(payload.amount) : existing.amount,

    currency: payload.currency,

    pageType: payload.pageType,

    paymentLinkReference: payload.paymentLinkReference,

    paymentLink: `https://payx.press/${payload.paymentLinkReference}`,

    isFixedAmount: payload.isFixedAmount ?? existing.isFixedAmount,

    redirectUrl: payload.redirectUrl,

    isPhoneNumberRequired:
      payload.isPhoneNumberRequired ?? existing.isPhoneNumberRequired,

    isTestMode: payload.isTestMode ?? existing.isTestMode,

    subAccountId: payload.subAccountId,

    subAccountGroupId: payload.subAccountGroupId,

    extraFields: payload.extraFields,

    updatedAt: new Date().toISOString(),
  };

  return {
    responseCode: "00",

    responseMessage: "Payment page updated",

    data: null,
  };
}
