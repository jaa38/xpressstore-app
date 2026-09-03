import type { Transaction } from "@/types/transaction";

/**
 * ============================================================================
 * MOCK TRANSACTIONS
 * ============================================================================
 *
 * These transactions represent the transactions belonging to the development
 * merchant.
 *
 * Development merchant ID:
 *
 * M12345
 */

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "txn_001",
    customer: "Daniel Okafor",
    type: "credit",
    status: "paid",
    channel: "card",
    amount: 125000,
    currency: "NGN",
    reference: "TXN-20260821-001",
    createdAt: "2026-08-21T14:32:00.000Z",
  },
  {
    id: "txn_002",
    customer: "Amaka Eze",
    type: "credit",
    status: "paid",
    channel: "bank",
    amount: 85000,
    currency: "NGN",
    reference: "TXN-20260821-002",
    createdAt: "2026-08-21T13:18:00.000Z",
  },
  {
    id: "txn_003",
    customer: "Chinedu Obi",
    type: "credit",
    status: "pending",
    channel: "transfer",
    amount: 45000,
    currency: "NGN",
    reference: "TXN-20260821-003",
    createdAt: "2026-08-21T11:45:00.000Z",
  },
  {
    id: "txn_004",
    customer: "Blessing Adeyemi",
    type: "credit",
    status: "failed",
    channel: "ussd",
    amount: 30000,
    currency: "NGN",
    reference: "TXN-20260821-004",
    createdAt: "2026-08-21T10:21:00.000Z",
  },
  {
    id: "txn_005",
    customer: "Tunde Balogun",
    type: "credit",
    status: "paid",
    channel: "qr",
    amount: 75000,
    currency: "NGN",
    reference: "TXN-20260820-005",
    createdAt: "2026-08-20T16:12:00.000Z",
  },
  {
    id: "txn_006",
    customer: "Ngozi Nwosu",
    type: "credit",
    status: "paid",
    channel: "card",
    amount: 150000,
    currency: "NGN",
    reference: "TXN-20260820-006",
    createdAt: "2026-08-20T14:40:00.000Z",
  },
  {
    id: "txn_007",
    customer: "Emeka Umeh",
    type: "credit",
    status: "pending",
    channel: "bank",
    amount: 55000,
    currency: "NGN",
    reference: "TXN-20260820-007",
    createdAt: "2026-08-20T12:30:00.000Z",
  },
  {
    id: "txn_008",
    customer: "Aisha Mohammed",
    type: "credit",
    status: "paid",
    channel: "transfer",
    amount: 95000,
    currency: "NGN",
    reference: "TXN-20260820-008",
    createdAt: "2026-08-20T10:14:00.000Z",
  },
  {
    id: "txn_009",
    customer: "Yusuf Ibrahim",
    type: "credit",
    status: "failed",
    channel: "card",
    amount: 40000,
    currency: "NGN",
    reference: "TXN-20260819-009",
    createdAt: "2026-08-19T17:05:00.000Z",
  },
  {
    id: "txn_010",
    customer: "Fatima Bello",
    type: "credit",
    status: "paid",
    channel: "ussd",
    amount: 65000,
    currency: "NGN",
    reference: "TXN-20260819-010",
    createdAt: "2026-08-19T15:22:00.000Z",
  },
  {
    id: "txn_011",
    customer: "Ibrahim Musa",
    type: "credit",
    status: "paid",
    channel: "bank",
    amount: 200000,
    currency: "NGN",
    reference: "TXN-20260819-011",
    createdAt: "2026-08-19T13:11:00.000Z",
  },
  {
    id: "txn_012",
    customer: "Esther Johnson",
    type: "credit",
    status: "pending",
    channel: "qr",
    amount: 35000,
    currency: "NGN",
    reference: "TXN-20260819-012",
    createdAt: "2026-08-19T11:48:00.000Z",
  },
  {
    id: "txn_013",
    customer: "Samuel Okoro",
    type: "credit",
    status: "paid",
    channel: "transfer",
    amount: 120000,
    currency: "NGN",
    reference: "TXN-20260818-013",
    createdAt: "2026-08-18T16:35:00.000Z",
  },
  {
    id: "txn_014",
    customer: "Joyce Williams",
    type: "credit",
    status: "failed",
    channel: "card",
    amount: 50000,
    currency: "NGN",
    reference: "TXN-20260818-014",
    createdAt: "2026-08-18T14:20:00.000Z",
  },
  {
    id: "txn_015",
    customer: "Peter Adekunle",
    type: "credit",
    status: "paid",
    channel: "bank",
    amount: 180000,
    currency: "NGN",
    reference: "TXN-20260818-015",
    createdAt: "2026-08-18T12:45:00.000Z",
  },
  {
    id: "txn_016",
    customer: "Maryam Sule",
    type: "credit",
    status: "pending",
    channel: "ussd",
    amount: 25000,
    currency: "NGN",
    reference: "TXN-20260818-016",
    createdAt: "2026-08-18T10:30:00.000Z",
  },
  {
    id: "txn_017",
    customer: "Kingsley Nnamdi",
    type: "credit",
    status: "paid",
    channel: "qr",
    amount: 90000,
    currency: "NGN",
    reference: "TXN-20260817-017",
    createdAt: "2026-08-17T17:18:00.000Z",
  },
  {
    id: "txn_018",
    customer: "Sarah James",
    type: "credit",
    status: "paid",
    channel: "card",
    amount: 110000,
    currency: "NGN",
    reference: "TXN-20260817-018",
    createdAt: "2026-08-17T15:46:00.000Z",
  },
  {
    id: "txn_019",
    customer: "Michael Ojo",
    type: "credit",
    status: "failed",
    channel: "transfer",
    amount: 70000,
    currency: "NGN",
    reference: "TXN-20260817-019",
    createdAt: "2026-08-17T13:25:00.000Z",
  },
  {
    id: "txn_020",
    customer: "Grace Eze",
    type: "credit",
    status: "paid",
    channel: "bank",
    amount: 135000,
    currency: "NGN",
    reference: "TXN-20260817-020",
    createdAt: "2026-08-17T11:12:00.000Z",
  },
  {
    id: "txn_021",
    customer: "David Adeola",
    type: "credit",
    status: "pending",
    channel: "card",
    amount: 60000,
    currency: "NGN",
    reference: "TXN-20260816-021",
    createdAt: "2026-08-16T16:40:00.000Z",
  },
  {
    id: "txn_022",
    customer: "Janet Okeke",
    type: "credit",
    status: "paid",
    channel: "ussd",
    amount: 45000,
    currency: "NGN",
    reference: "TXN-20260816-022",
    createdAt: "2026-08-16T14:30:00.000Z",
  },
  {
    id: "txn_023",
    customer: "Victor Adebayo",
    type: "credit",
    status: "paid",
    channel: "transfer",
    amount: 100000,
    currency: "NGN",
    reference: "TXN-20260816-023",
    createdAt: "2026-08-16T13:15:00.000Z",
  },
  {
    id: "txn_024",
    customer: "Ruth Chukwu",
    type: "credit",
    status: "failed",
    channel: "qr",
    amount: 30000,
    currency: "NGN",
    reference: "TXN-20260816-024",
    createdAt: "2026-08-16T11:50:00.000Z",
  },
  {
    id: "txn_025",
    customer: "Collins Obi",
    type: "credit",
    status: "paid",
    channel: "card",
    amount: 145000,
    currency: "NGN",
    reference: "TXN-20260816-025",
    createdAt: "2026-08-16T10:25:00.000Z",
  },
  {
    id: "txn_026",
    customer: "Funke Ajayi",
    type: "credit",
    status: "pending",
    channel: "bank",
    amount: 80000,
    currency: "NGN",
    reference: "TXN-20260816-026",
    createdAt: "2026-08-16T09:40:00.000Z",
  },
  {
    id: "txn_027",
    customer: "Olumide Lawal",
    type: "credit",
    status: "paid",
    channel: "transfer",
    amount: 175000,
    currency: "NGN",
    reference: "TXN-20260816-027",
    createdAt: "2026-08-16T08:35:00.000Z",
  },
  {
    id: "txn_028",
    customer: "Abigail David",
    type: "credit",
    status: "paid",
    channel: "ussd",
    amount: 55000,
    currency: "NGN",
    reference: "TXN-20260816-028",
    createdAt: "2026-08-16T08:10:00.000Z",
  },
  {
    id: "txn_029",
    customer: "Ifeanyi Okafor",
    type: "credit",
    status: "failed",
    channel: "card",
    amount: 90000,
    currency: "NGN",
    reference: "TXN-20260816-029",
    createdAt: "2026-08-16T07:45:00.000Z",
  },
  {
    id: "txn_030",
    customer: "Temitope Akinola",
    type: "credit",
    status: "paid",
    channel: "qr",
    amount: 70000,
    currency: "NGN",
    reference: "TXN-20260816-030",
    createdAt: "2026-08-16T07:20:00.000Z",
  },
];

/**
 * ============================================================================
 * MERCHANT-SCOPED MOCK TRANSACTIONS
 * ============================================================================
 */

const mockTransactionsByMerchant: Record<string, Transaction[]> = {
  M12345: [...MOCK_TRANSACTIONS],
};

/**
 * ============================================================================
 * GET TRANSACTIONS FOR MERCHANT
 * ============================================================================
 */

export function getMockTransactionsForMerchant(
  merchantId: string
): Transaction[] {
  return [...(mockTransactionsByMerchant[merchantId] ?? [])];
}

/**
 * ============================================================================
 * SET TRANSACTIONS FOR MERCHANT
 * ============================================================================
 */

export function setMockTransactionsForMerchant(
  merchantId: string,
  transactions: Transaction[]
): void {
  mockTransactionsByMerchant[merchantId] = [...transactions];
}

/**
 * ============================================================================
 * DELETE TRANSACTIONS FOR MERCHANT
 * ============================================================================
 */

export function deleteMockTransactionsForMerchant(merchantId: string): void {
  delete mockTransactionsByMerchant[merchantId];
}

/**
 * ============================================================================
 * MOCK QUERY FILTERS
 * ============================================================================
 */

export interface MockTransactionsQueryFilters {
  status?: string | null;

  reference?: string | null;

  transactionId?: string | null;

  paymentMethod?: string | null;

  startDate?: string | null;

  endDate?: string | null;
}

/**
 * ============================================================================
 * MOCK TRANSACTION STATUS MATCHER
 * ============================================================================
 */

function matchesMockStatus(transaction: Transaction, status: string): boolean {
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
 * MOCK TRANSACTIONS PAGE
 * ============================================================================
 */

export async function getMockTransactionsPage(
  page = 1,
  limit = 20,
  filter: MockTransactionsQueryFilters = {},
  merchantId = "M12345"
) {
  const safePage = Math.max(1, page);

  const safeLimit = Math.max(1, limit);

  const merchantTransactions = getMockTransactionsForMerchant(merchantId);

  let filteredTransactions = [...merchantTransactions];

  /**
   * --------------------------------------------------------------------------
   * STATUS
   * --------------------------------------------------------------------------
   */

  if (filter.status) {
    filteredTransactions = filteredTransactions.filter((transaction) =>
      matchesMockStatus(transaction, filter.status as string)
    );
  }

  /**
   * --------------------------------------------------------------------------
   * REFERENCE
   * --------------------------------------------------------------------------
   */

  if (filter.reference) {
    const reference = filter.reference.trim().toLowerCase();

    filteredTransactions = filteredTransactions.filter((transaction) =>
      transaction.reference.toLowerCase().includes(reference)
    );
  }

  /**
   * --------------------------------------------------------------------------
   * TRANSACTION ID
   * --------------------------------------------------------------------------
   */

  if (filter.transactionId) {
    const transactionId = filter.transactionId.trim().toLowerCase();

    filteredTransactions = filteredTransactions.filter((transaction) =>
      transaction.id.toLowerCase().includes(transactionId)
    );
  }

  /**
   * --------------------------------------------------------------------------
   * PAYMENT METHOD
   * --------------------------------------------------------------------------
   */

  if (filter.paymentMethod) {
    const paymentMethod = filter.paymentMethod.trim().toLowerCase();

    filteredTransactions = filteredTransactions.filter(
      (transaction) => transaction.channel.toLowerCase() === paymentMethod
    );
  }

  /**
   * --------------------------------------------------------------------------
   * START DATE
   * --------------------------------------------------------------------------
   */

  if (filter.startDate) {
    const startDate = new Date(filter.startDate);

    filteredTransactions = filteredTransactions.filter(
      (transaction) => new Date(transaction.createdAt) >= startDate
    );
  }

  /**
   * --------------------------------------------------------------------------
   * END DATE
   * --------------------------------------------------------------------------
   */

  if (filter.endDate) {
    const endDate = new Date(filter.endDate);

    filteredTransactions = filteredTransactions.filter(
      (transaction) => new Date(transaction.createdAt) <= endDate
    );
  }

  /**
   * --------------------------------------------------------------------------
   * PAGINATION
   * --------------------------------------------------------------------------
   */

  const startIndex = (safePage - 1) * safeLimit;

  const endIndex = startIndex + safeLimit;

  const transactions = filteredTransactions.slice(startIndex, endIndex);

  return {
    responseCode: "00",

    responseMessage: "Transactions loaded from mock data.",

    data: {
      transactions,

      totalCount: filteredTransactions.length,

      pageNumber: safePage,

      pageSize: safeLimit,
    },
  };
}

/**
 * ============================================================================
 * RESET MOCK TRANSACTIONS
 * ============================================================================
 */

export function resetMockTransactions(): void {
  mockTransactionsByMerchant.M12345 = [...MOCK_TRANSACTIONS];
}
