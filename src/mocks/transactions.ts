import type { Transaction } from "@/types/transaction";

/**
 * ============================================================================
 * MOCK TRANSACTIONS
 * ============================================================================
 */

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "txn_001",
    customer: "Daniel Okafor",
    type: "credit",
    status: "paid",
    channel: "card",
    amount: 185000,
    currency: "NGN",
    reference: "XPS-000001",
    createdAt: "2026-08-21T09:30:00.000Z",
  },
  {
    id: "txn_002",
    customer: "Amaka Eze",
    type: "credit",
    status: "paid",
    channel: "bank",
    amount: 45000,
    currency: "NGN",
    reference: "XPS-000002",
    createdAt: "2026-08-21T08:45:00.000Z",
  },
  {
    id: "txn_003",
    customer: "Michael Adeyemi",
    type: "credit",
    status: "pending",
    channel: "transfer",
    amount: 75000,
    currency: "NGN",
    reference: "XPS-000003",
    createdAt: "2026-08-21T08:10:00.000Z",
  },
  {
    id: "txn_004",
    customer: "Grace Williams",
    type: "credit",
    status: "failed",
    channel: "card",
    amount: 120000,
    currency: "NGN",
    reference: "XPS-000004",
    createdAt: "2026-08-20T17:30:00.000Z",
  },
  {
    id: "txn_005",
    customer: "Ibrahim Musa",
    type: "credit",
    status: "paid",
    channel: "ussd",
    amount: 25000,
    currency: "NGN",
    reference: "XPS-000005",
    createdAt: "2026-08-20T16:50:00.000Z",
  },
  {
    id: "txn_006",
    customer: "Sarah Johnson",
    type: "credit",
    status: "paid",
    channel: "card",
    amount: 350000,
    currency: "NGN",
    reference: "XPS-000006",
    createdAt: "2026-08-20T15:40:00.000Z",
  },
  {
    id: "txn_007",
    customer: "Chinedu Okoro",
    type: "credit",
    status: "pending",
    channel: "qr",
    amount: 65000,
    currency: "NGN",
    reference: "XPS-000007",
    createdAt: "2026-08-20T14:25:00.000Z",
  },
  {
    id: "txn_008",
    customer: "Blessing Joseph",
    type: "credit",
    status: "paid",
    channel: "transfer",
    amount: 95000,
    currency: "NGN",
    reference: "XPS-000008",
    createdAt: "2026-08-20T13:10:00.000Z",
  },
  {
    id: "txn_009",
    customer: "Tunde Balogun",
    type: "credit",
    status: "failed",
    channel: "ussd",
    amount: 18000,
    currency: "NGN",
    reference: "XPS-000009",
    createdAt: "2026-08-20T11:45:00.000Z",
  },
  {
    id: "txn_010",
    customer: "Esther Adebayo",
    type: "credit",
    status: "paid",
    channel: "card",
    amount: 210000,
    currency: "NGN",
    reference: "XPS-000010",
    createdAt: "2026-08-20T10:20:00.000Z",
  },
  {
    id: "txn_011",
    customer: "David Nwosu",
    type: "credit",
    status: "pending",
    channel: "bank",
    amount: 55000,
    currency: "NGN",
    reference: "XPS-000011",
    createdAt: "2026-08-20T09:15:00.000Z",
  },
  {
    id: "txn_012",
    customer: "Mercy Peter",
    type: "credit",
    status: "paid",
    channel: "card",
    amount: 80000,
    currency: "NGN",
    reference: "XPS-000012",
    createdAt: "2026-08-19T18:40:00.000Z",
  },
  {
    id: "txn_013",
    customer: "Samuel Obi",
    type: "credit",
    status: "paid",
    channel: "transfer",
    amount: 150000,
    currency: "NGN",
    reference: "XPS-000013",
    createdAt: "2026-08-19T16:30:00.000Z",
  },
  {
    id: "txn_014",
    customer: "Aisha Bello",
    type: "credit",
    status: "failed",
    channel: "qr",
    amount: 32000,
    currency: "NGN",
    reference: "XPS-000014",
    createdAt: "2026-08-19T15:20:00.000Z",
  },
  {
    id: "txn_015",
    customer: "Kevin Martins",
    type: "credit",
    status: "paid",
    channel: "card",
    amount: 275000,
    currency: "NGN",
    reference: "XPS-000015",
    createdAt: "2026-08-19T13:45:00.000Z",
  },
  {
    id: "txn_016",
    customer: "Joyce Williams",
    type: "credit",
    status: "pending",
    channel: "bank",
    amount: 40000,
    currency: "NGN",
    reference: "XPS-000016",
    createdAt: "2026-08-19T12:30:00.000Z",
  },
  {
    id: "txn_017",
    customer: "Femi Lawal",
    type: "credit",
    status: "paid",
    channel: "ussd",
    amount: 70000,
    currency: "NGN",
    reference: "XPS-000017",
    createdAt: "2026-08-19T11:15:00.000Z",
  },
  {
    id: "txn_018",
    customer: "Nneka Ibe",
    type: "credit",
    status: "failed",
    channel: "card",
    amount: 125000,
    currency: "NGN",
    reference: "XPS-000018",
    createdAt: "2026-08-19T09:40:00.000Z",
  },
  {
    id: "txn_019",
    customer: "Yusuf Ibrahim",
    type: "credit",
    status: "paid",
    channel: "transfer",
    amount: 90000,
    currency: "NGN",
    reference: "XPS-000019",
    createdAt: "2026-08-18T17:20:00.000Z",
  },
  {
    id: "txn_020",
    customer: "Adaeze Chukwu",
    type: "credit",
    status: "paid",
    channel: "qr",
    amount: 60000,
    currency: "NGN",
    reference: "XPS-000020",
    createdAt: "2026-08-18T16:10:00.000Z",
  },
  {
    id: "txn_021",
    customer: "Emeka Uche",
    type: "credit",
    status: "pending",
    channel: "card",
    amount: 220000,
    currency: "NGN",
    reference: "XPS-000021",
    createdAt: "2026-08-18T14:50:00.000Z",
  },
  {
    id: "txn_022",
    customer: "Hannah Cole",
    type: "credit",
    status: "paid",
    channel: "ussd",
    amount: 30000,
    currency: "NGN",
    reference: "XPS-000022",
    createdAt: "2026-08-18T13:35:00.000Z",
  },
  {
    id: "txn_023",
    customer: "Peter James",
    type: "credit",
    status: "failed",
    channel: "bank",
    amount: 110000,
    currency: "NGN",
    reference: "XPS-000023",
    createdAt: "2026-08-18T12:20:00.000Z",
  },
  {
    id: "txn_024",
    customer: "Rita Okeke",
    type: "credit",
    status: "paid",
    channel: "card",
    amount: 145000,
    currency: "NGN",
    reference: "XPS-000024",
    createdAt: "2026-08-18T10:45:00.000Z",
  },
  {
    id: "txn_025",
    customer: "Oluwaseun Adeola",
    type: "credit",
    status: "paid",
    channel: "transfer",
    amount: 50000,
    currency: "NGN",
    reference: "XPS-000025",
    createdAt: "2026-08-17T17:30:00.000Z",
  },
  {
    id: "txn_026",
    customer: "Fatima Abdullahi",
    type: "credit",
    status: "pending",
    channel: "qr",
    amount: 85000,
    currency: "NGN",
    reference: "XPS-000026",
    createdAt: "2026-08-17T15:15:00.000Z",
  },
  {
    id: "txn_027",
    customer: "Chris Morgan",
    type: "credit",
    status: "paid",
    channel: "card",
    amount: 190000,
    currency: "NGN",
    reference: "XPS-000027",
    createdAt: "2026-08-17T13:40:00.000Z",
  },
  {
    id: "txn_028",
    customer: "Ngozi Eze",
    type: "credit",
    status: "failed",
    channel: "ussd",
    amount: 27000,
    currency: "NGN",
    reference: "XPS-000028",
    createdAt: "2026-08-17T11:20:00.000Z",
  },
  {
    id: "txn_029",
    customer: "Marcus Brown",
    type: "credit",
    status: "paid",
    channel: "bank",
    amount: 135000,
    currency: "NGN",
    reference: "XPS-000029",
    createdAt: "2026-08-17T09:50:00.000Z",
  },
  {
    id: "txn_030",
    customer: "Temitope Akinyemi",
    type: "credit",
    status: "paid",
    channel: "card",
    amount: 72000,
    currency: "NGN",
    reference: "XPS-000030",
    createdAt: "2026-08-16T16:30:00.000Z",
  },
];

/**
 * ============================================================================
 * MOCK TRANSACTION FILTER
 * ============================================================================
 *
 * Mirrors the documented GraphQL TransactionFilterInput.
 *
 * Supported server-side filters:
 *
 * - customerEmail
 * - reference
 * - transactionId
 * - startDate
 * - endDate
 * - cardBrand
 * - paymentMethod
 * - status
 *
 * The local Transaction model only contains enough information to faithfully
 * reproduce:
 *
 * - reference
 * - transactionId
 * - startDate
 * - endDate
 * - status
 * - paymentMethod
 * ============================================================================
 */

export interface MockTransactionsQueryFilters {
  customerEmail?: string | null;

  reference?: string | null;

  transactionId?: string | null;

  startDate?: string | null;

  endDate?: string | null;

  cardBrand?: string | null;

  paymentMethod?: string | null;

  status?: string | null;
}

/**
 * ============================================================================
 * MERCHANT-ISOLATED MOCK TRANSACTIONS
 * ============================================================================
 *
 * Each merchant has its own transaction collection.
 *
 * This is important because mock data must behave like real account-scoped
 * data. A merchant should never see another merchant's transactions.
 *
 * The first mock merchant receives the existing demo transactions.
 * New merchants start with an empty transaction collection.
 * ============================================================================
 */

const mockTransactionsByMerchant: Record<string, Transaction[]> = {
  "mock-merchant-001": [...MOCK_TRANSACTIONS],
};

/**
 * ============================================================================
 * GET MERCHANT TRANSACTIONS
 * ============================================================================
 */

export function getMockTransactionsForMerchant(
  merchantId: string
): Transaction[] {
  return [
    ...(mockTransactionsByMerchant[merchantId] ?? []),
  ];
}

/**
 * ============================================================================
 * SET MERCHANT TRANSACTIONS
 * ============================================================================
 */

export function setMockTransactionsForMerchant(
  merchantId: string,
  transactions: Transaction[]
): void {
  mockTransactionsByMerchant[merchantId] = [
    ...transactions,
  ];
}

/**
 * ============================================================================
 * CLEAR MERCHANT TRANSACTIONS
 * ============================================================================
 */

export function clearMockTransactionsForMerchant(
  merchantId: string
): void {
  delete mockTransactionsByMerchant[merchantId];
}

/**
 * ============================================================================
 * MOCK TRANSACTION STATUS
 * ============================================================================
 */

function matchesMockStatus(
  transaction: Transaction,
  status: string
): boolean {
  const normalizedStatus = status.trim().toLowerCase();

  switch (normalizedStatus) {
    case "successful":
    case "success":
    case "paid":
      return transaction.status === "paid";

    case "pending":
      return transaction.status === "pending";

    case "failed":
    case "failure":
      return transaction.status === "failed";

    default:
      return true;
  }
}

/**
 * ============================================================================
 * MOCK TRANSACTION PAGE
 * ============================================================================
 *
 * Mirrors the response shape of:
 *
 * transactions {
 *   items
 *   totalCount
 *   pageNumber
 *   pageSize
 * }
 *
 * Supported mock filters:
 *
 * - status
 * - startDate
 * - endDate
 * - reference
 * - transactionId
 * - paymentMethod
 * ============================================================================
 */

export async function getMockTransactionsPage(
  page = 1,
  limit = 20,
  filter: MockTransactionsQueryFilters = {},
  merchantId = "mock-merchant-001"
) {
  const safePage = Math.max(1, page);

  const safeLimit = Math.max(1, limit);

  const merchantTransactions =
    getMockTransactionsForMerchant(merchantId);

  const normalizedStatus =
    filter.status?.trim().toLowerCase() ?? null;

  const normalizedPaymentMethod =
    filter.paymentMethod?.trim().toLowerCase() ?? null;

  const normalizedReference =
    filter.reference?.trim().toLowerCase() ?? null;

  const normalizedTransactionId =
    filter.transactionId?.trim().toLowerCase() ?? null;

  const filteredTransactions =
    merchantTransactions.filter((transaction) => {
      /**
       * ----------------------------------------------------------------------
       * Status
       * ----------------------------------------------------------------------
       */

      if (normalizedStatus) {
        if (
          !matchesMockStatus(
            transaction,
            normalizedStatus
          )
        ) {
          return false;
        }
      }

      /**
       * ----------------------------------------------------------------------
       * Reference
       * ----------------------------------------------------------------------
       */

      if (
        normalizedReference &&
        !transaction.reference
          .toLowerCase()
          .includes(normalizedReference)
      ) {
        return false;
      }

      /**
       * ----------------------------------------------------------------------
       * Transaction ID
       * ----------------------------------------------------------------------
       */

      if (
        normalizedTransactionId &&
        !transaction.id
          .toLowerCase()
          .includes(normalizedTransactionId)
      ) {
        return false;
      }

      /**
       * ----------------------------------------------------------------------
       * Payment Method
       * ----------------------------------------------------------------------
       */

      if (
        normalizedPaymentMethod &&
        transaction.channel.toLowerCase() !==
          normalizedPaymentMethod
      ) {
        return false;
      }

      /**
       * ----------------------------------------------------------------------
       * Start Date
       * ----------------------------------------------------------------------
       */

      if (filter.startDate) {
        const transactionDate = new Date(
          transaction.createdAt
        );

        const startDate = new Date(
          filter.startDate
        );

        if (transactionDate < startDate) {
          return false;
        }
      }

      /**
       * ----------------------------------------------------------------------
       * End Date
       * ----------------------------------------------------------------------
       */

      if (filter.endDate) {
        const transactionDate = new Date(
          transaction.createdAt
        );

        const endDate = new Date(
          filter.endDate
        );

        if (transactionDate > endDate) {
          return false;
        }
      }

      /**
       * ----------------------------------------------------------------------
       * Unsupported documented fields
       * ----------------------------------------------------------------------
       *
       * customerEmail and cardBrand are part of the backend contract,
       * but the local Transaction model does not contain those values.
       *
       * We therefore intentionally do not invent filtering behaviour.
       */

      return true;
    });

  const startIndex =
    (safePage - 1) * safeLimit;

  const endIndex =
    startIndex + safeLimit;

  const transactions =
    filteredTransactions.slice(
      startIndex,
      endIndex
    );

  return {
    responseCode: "00",

    responseMessage:
      "Transactions loaded from mock data.",

    data: {
      transactions,

      totalCount:
        filteredTransactions.length,

      pageNumber: safePage,

      pageSize: safeLimit,
    },
  };
}