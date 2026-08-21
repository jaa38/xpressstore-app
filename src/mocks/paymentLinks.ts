// src/mocks/paymentLinks.ts

import type {
  PaymentLink,
  PaymentLinkTransaction,
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

    description:
      "Payment for Nike Air Max sneakers",

    amount: 185000,

    currency: "NGN",

    pageType: "single",

    paymentLinkReference:
      "nike-air-max",

    paymentLink:
      "https://payx.press/nike-air-max",

    isActive: true,

    isFixedAmount: true,

    isPhoneNumberRequired: true,

    isTestMode: false,

    createdAt:
      "2026-08-10T09:00:00.000Z",

    updatedAt:
      "2026-08-19T12:30:00.000Z",
  },

  {
    id: 2,

    name: "Premium T-Shirt",

    description:
      "Premium cotton T-shirt",

    amount: 45000,

    currency: "NGN",

    pageType: "single",

    paymentLinkReference:
      "premium-tshirt",

    paymentLink:
      "https://payx.press/premium-tshirt",

    isActive: true,

    isFixedAmount: true,

    isPhoneNumberRequired: true,

    isTestMode: false,

    createdAt:
      "2026-08-11T10:30:00.000Z",

    updatedAt:
      "2026-08-20T10:15:00.000Z",
  },

  {
    id: 3,

    name: "Home Decor Package",

    description:
      "Modern home decor package",

    amount: 97500,

    currency: "NGN",

    pageType: "single",

    paymentLinkReference:
      "home-decor",

    paymentLink:
      "https://payx.press/home-decor",

    isActive: true,

    isFixedAmount: true,

    isPhoneNumberRequired: false,

    isTestMode: false,

    createdAt:
      "2026-08-12T08:45:00.000Z",

    updatedAt:
      "2026-08-19T15:45:00.000Z",
  },

  {
    id: 4,

    name: "Community Donation",

    description:
      "Support our community initiative",

    amount: 25000,

    currency: "NGN",

    pageType: "donation",

    paymentLinkReference:
      "community-donation",

    paymentLink:
      "https://payx.press/community-donation",

    isActive: true,

    isFixedAmount: false,

    isPhoneNumberRequired: true,

    isTestMode: false,

    createdAt:
      "2026-08-13T11:20:00.000Z",

    updatedAt:
      "2026-08-18T09:20:00.000Z",
  },

  {
    id: 5,

    name: "Old Product Link",

    description:
      "Previous product payment page",

    amount: 65000,

    currency: "NGN",

    pageType: "single",

    paymentLinkReference:
      "old-product",

    paymentLink:
      "https://payx.press/old-product",

    isActive: false,

    isFixedAmount: true,

    isPhoneNumberRequired: false,

    isTestMode: false,

    createdAt:
      "2026-07-20T13:00:00.000Z",

    updatedAt:
      "2026-08-01T09:00:00.000Z",
  },

  {
    id: 6,

    name: "Wireless Headphones",

    description:
      "Premium wireless headphones",

    amount: 85000,

    currency: "NGN",

    pageType: "single",

    paymentLinkReference:
      "wireless-headphones",

    paymentLink:
      "https://payx.press/wireless-headphones",

    isActive: true,

    isFixedAmount: true,

    isPhoneNumberRequired: true,

    isTestMode: false,

    createdAt:
      "2026-08-14T14:00:00.000Z",

    updatedAt:
      "2026-08-20T16:10:00.000Z",
  },
];

/**
 * ============================================================================
 * MOCK PAYMENT LINK TRANSACTIONS
 * ============================================================================
 *
 * Transactions are mapped by payment-link ID.
 */

export const MOCK_TRANSACTIONS_BY_PAYMENT_LINK_ID =
  new Map<number, PaymentLinkTransaction[]>([
    [
      1,

      [
        {
          transactionId:
            "TXN-NIKE-001",

          amount: 185000,

          status: "successful",

          dateCreated:
            "2026-08-19T12:30:00.000Z",
        },
      ],
    ],

    [
      2,

      [
        {
          transactionId:
            "TXN-TSHIRT-001",

          amount: 45000,

          status: "pending",

          dateCreated:
            "2026-08-20T10:15:00.000Z",
        },
      ],
    ],

    [
      3,

      [
        {
          transactionId:
            "TXN-HOME-001",

          amount: 97500,

          status: "failed",

          dateCreated:
            "2026-08-19T15:45:00.000Z",
        },
      ],
    ],

    [
      4,

      [
        {
          transactionId:
            "TXN-DONATION-001",

          amount: 25000,

          status: "successful",

          dateCreated:
            "2026-08-18T09:20:00.000Z",
        },
      ],
    ],

    /**
     * Inactive payment link.
     */
    [5, []],

    [
      6,

      [
        {
          transactionId:
            "TXN-HEADPHONES-001",

          amount: 85000,

          status: "successful",

          dateCreated:
            "2026-08-20T16:10:00.000Z",
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
 * Returning a new array prevents the screen from accidentally mutating
 * the source array directly.
 */
export function getMockPaymentLinks(): PaymentLink[] {
  return [...MOCK_PAYMENT_LINKS];
}

/**
 * Get a payment link by ID.
 */
export function getMockPaymentLinkById(
  id: number
): PaymentLink | undefined {
  return MOCK_PAYMENT_LINKS.find(
    (link) => link.id === id
  );
}

/**
 * Get transactions for a payment link.
 */
export function getMockPaymentLinkTransactions(
  paymentLinkId: number
): PaymentLinkTransaction[] {
  return [
    ...(MOCK_TRANSACTIONS_BY_PAYMENT_LINK_ID.get(
      paymentLinkId
    ) ?? []),
  ];
}

/**
 * Get the complete transaction map.
 */
export function getMockPaymentLinkTransactionMap() {
  return new Map(
    Array.from(
      MOCK_TRANSACTIONS_BY_PAYMENT_LINK_ID.entries()
    ).map(([id, transactions]) => [
      id,
      [...transactions],
    ])
  );
}