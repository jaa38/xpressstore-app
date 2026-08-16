import { graphqlRequest } from "@/api/graphql-client";

import { transactionRepository } from "@/repositories/transactions/sqliteTransactionRepository";

import type { Currency } from "@/types/currency";
import type { Transaction } from "@/types/transaction";

/**
 * ============================================================================
 * GraphQL DTO
 * ============================================================================
 *
 * Matches the documented `transactions` GraphQL query in:
 *
 * docs/api/11_graphql.md
 *
 * This is the general payment transaction API.
 *
 * It is intentionally separate from the storeTransactions DTO used by
 * order-service.ts.
 */

interface TransactionDto {
  id: number;

  transactionReference: string;

  firstname: string;

  lastname: string;

  amount: number;

  paymentType: string;

  email: string;

  pageName: string;

  pageType: string;

  currency: string;

  transactionId: string;

  xpressReference: string;

  providerReference: string;

  phoneNumber: string;

  narration: string;

  cardBin: string;

  brand: string;

  cardType: string;

  processor: string;

  merchantId: string;

  paymentResponseCode: string;

  paymentResponseMessage: string;

  dateCreated: string;

  dateModified: string;

  transType: string;

  cardPan: string;

  metaData: string | null;

  productDescription: string;

  merchantName: string;

  transactionNumber: string;

  transactionDate: string;
}

interface TransactionsResult {
  transactions: {
    items: TransactionDto[];

    totalCount: number;

    pageNumber: number;

    pageSize: number;
  };
}

export interface TransactionsPage {
  transactions: Transaction[];

  totalCount: number;

  pageNumber: number;

  pageSize: number;
}

/**
 * ============================================================================
 * GraphQL Query
 * ============================================================================
 *
 * Source:
 * docs/api/11_graphql.md
 */

const TRANSACTIONS_QUERY = `
  query GetTransactions(
    $page: Int!
    $limit: Int!
    $filter: TransactionFilterInput!
  ) {
    transactions(
      page: $page
      limit: $limit
      filter: $filter
    ) {
      items {
        id
        transactionReference
        firstname
        lastname
        amount
        paymentType
        email
        pageName
        pageType
        currency
        transactionId
        xpressReference
        providerReference
        phoneNumber
        narration
        cardBin
        brand
        cardType
        processor
        merchantId
        paymentResponseCode
        paymentResponseMessage
        dateCreated
        dateModified
        transType
        cardPan
        metaData
        productDescription
        merchantName
        transactionNumber
        transactionDate
      }

      totalCount
      pageNumber
      pageSize
    }
  }
`;

/**
 * ============================================================================
 * GraphQL Filter
 * ============================================================================
 */

export interface TransactionsQueryFilters {
  customerEmail?: string | null;

  reference?: string | null;

  transactionId?: string | null;

  startDate?: string | null;

  endDate?: string | null;

  cardBrand?: string | null;

  paymentMethod?: string | null;

  status?: string | null;
}

export interface TransactionFilter {
  customerEmail: string | null;

  reference: string | null;

  transactionId: string | null;

  startDate: string | null;

  endDate: string | null;

  cardBrand: string | null;

  paymentMethod: string | null;

  status: string | null;
}

/**
 * ============================================================================
 * Status Mapper
 * ============================================================================
 *
 * The general transactions query does not document a dedicated status field.
 *
 * The available response fields include:
 *
 * - paymentResponseCode
 * - paymentResponseMessage
 *
 * Therefore we should not invent a backend status mapping beyond what the
 * documented response supports.
 *
 * Xpress uses response code `00` for successful responses elsewhere in the
 * documented API.
 *
 * Non-successful responses are treated as failed.
 */

function mapTransactionStatus(
  transaction: TransactionDto
): Transaction["status"] {
  const responseCode = transaction.paymentResponseCode?.trim().toLowerCase();

  if (responseCode === "00") {
    return "paid";
  }

  return "failed";
}

/**
 * ============================================================================
 * Payment Channel Mapper
 * ============================================================================
 *
 * The documented general transaction response exposes `paymentType`.
 *
 * Transaction UI channels:
 *
 * - bank
 * - card
 * - qr
 * - transfer
 * - ussd
 */

function mapPaymentChannel(paymentType: string): Transaction["channel"] {
  const value = paymentType?.trim().toLowerCase();

  switch (value) {
    case "bank":
    case "bank account":
    case "account":
      return "bank";

    case "transfer":
    case "bank transfer":
      return "transfer";

    case "qr":
    case "nqr":
      return "qr";

    case "ussd":
      return "ussd";

    case "card":
    case "debit card":
    case "credit card":
    default:
      return "card";
  }
}

/**
 * ============================================================================
 * Currency Mapper
 * ============================================================================
 */

function mapCurrency(value: string): Currency {
  switch (value?.trim().toUpperCase()) {
    case "NGN":
      return "NGN";

    case "USD":
      return "USD";

    case "GBP":
      return "GBP";

    case "EUR":
      return "EUR";

    default:
      return "NGN";
  }
}

/**
 * ============================================================================
 * Transaction Mapper
 * ============================================================================
 */

function mapTransaction(transaction: TransactionDto): Transaction {
  const customerName = [transaction.firstname, transaction.lastname]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    id: transaction.transactionId || String(transaction.id),

    customer: customerName || transaction.email || "Unknown Customer",

    type:
      transaction.transType?.trim().toLowerCase() === "debit"
        ? "debit"
        : "credit",

    status: mapTransactionStatus(transaction),

    channel: mapPaymentChannel(transaction.paymentType),

    amount: Number(transaction.amount),

    currency: mapCurrency(transaction.currency),

    reference:
      transaction.transactionReference ||
      transaction.xpressReference ||
      transaction.transactionNumber ||
      transaction.transactionId,

    createdAt: transaction.transactionDate || transaction.dateCreated,
  };
}

/**
 * ============================================================================
 * Request Filter Mapper
 * ============================================================================
 */

function buildTransactionFilter(
  filter: Partial<TransactionFilter>
): TransactionFilter {
  return {
    customerEmail: filter.customerEmail ?? null,

    reference: filter.reference ?? null,

    transactionId: filter.transactionId ?? null,

    startDate: filter.startDate ?? null,

    endDate: filter.endDate ?? null,

    cardBrand: filter.cardBrand ?? null,

    paymentMethod: filter.paymentMethod ?? null,

    status: filter.status ?? null,
  };
}

/**
 * ============================================================================
 * Offline Pagination
 * ============================================================================
 *
 * The transaction repository currently exposes all locally stored
 * transactions but does not expose a paginated/filtering query.
 *
 * Therefore the service applies pagination to the locally persisted
 * transactions when the network request fails.
 *
 * This keeps the repository contract simple and avoids inventing
 * unsupported repository behaviour.
 */

function paginateTransactions(
  transactions: Transaction[],
  page: number,
  limit: number
): TransactionsPage {
  const safePage = Math.max(1, page);

  const safeLimit = Math.max(1, limit);

  const startIndex = (safePage - 1) * safeLimit;

  const endIndex = startIndex + safeLimit;

  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  const totalCount = transactions.length;

  const totalPages = totalCount === 0 ? 0 : Math.ceil(totalCount / safeLimit);

  return {
    transactions: paginatedTransactions,

    totalCount,

    pageNumber: safePage,

    pageSize: safeLimit,
  };
}

/**
 * ============================================================================
 * Get Transactions Page
 * ============================================================================
 */

export async function getTransactionsPage(
  page = 1,
  limit = 20,
  filter: Partial<TransactionFilter> = {}
): Promise<TransactionsPage> {
  const requestFilter = buildTransactionFilter(filter);

  try {
    /**
     * ------------------------------------------------------------------------
     * Online
     * ------------------------------------------------------------------------
     */

    const response = await graphqlRequest<TransactionsResult>({
      query: TRANSACTIONS_QUERY,

      variables: {
        page,

        limit,

        filter: requestFilter,
      },
    });

    const transactions = response.transactions.items.map(mapTransaction);

    /**
     * ------------------------------------------------------------------------
     * Persist successful API response
     * ------------------------------------------------------------------------
     *
     * Only successfully mapped transactions are persisted.
     *
     * The repository performs an upsert, so existing transactions are updated
     * without creating duplicates.
     */

    await transactionRepository.saveTransactions(transactions);

    return {
      transactions,

      totalCount: response.transactions.totalCount,

      pageNumber: response.transactions.pageNumber,

      pageSize: response.transactions.pageSize,
    };
  } catch (error) {
    /**
     * ------------------------------------------------------------------------
     * Offline fallback
     * ------------------------------------------------------------------------
     *
     * If the network request fails, use the locally persisted transactions.
     */

    console.warn(
      "Failed to fetch transactions from API. Using local SQLite data.",
      error
    );

    const cachedTransactions = await transactionRepository.getTransactions();

    if (cachedTransactions.length === 0) {
      throw error;
    }

    /**
     * --------------------------------------------------------------
     * Apply local pagination.
     * --------------------------------------------------------------
     *
     * The current repository does not support filtering, so we preserve
     * the repository contract and paginate the locally available records.
     *
     * If filtering requirements for offline mode are introduced later,
     * filtering can be added to the repository/service explicitly.
     */

    return paginateTransactions(cachedTransactions, page, limit);
  }
}

/**
 * ============================================================================
 * Get Transaction By ID
 * ============================================================================
 *
 * Uses the documented GraphQL `transactionId` filter to retrieve a single
 * transaction.
 *
 * The latest successful response is persisted locally.
 *
 * If the API request fails, the locally persisted transaction is returned.
 */

export async function getTransactionById(
  transactionId: string
): Promise<Transaction> {
  try {
    const response = await graphqlRequest<TransactionsResult>({
      query: TRANSACTIONS_QUERY,

      variables: {
        page: 1,

        limit: 1,

        filter: buildTransactionFilter({
          transactionId,
        }),
      },
    });

    const transactionDto = response.transactions.items[0];

    if (!transactionDto) {
      throw new Error("Transaction not found.");
    }

    const transaction = mapTransaction(transactionDto);

    /**
     * Persist the latest server response
     * locally for future offline access.
     */

    await transactionRepository.saveTransaction(transaction);

    return transaction;
  } catch (error) {
    /**
     * ------------------------------------------------------------------------
     * Offline fallback
     * ------------------------------------------------------------------------
     */

    const cachedTransaction =
      await transactionRepository.getTransactionById(transactionId);

    if (!cachedTransaction) {
      throw error;
    }

    console.warn(
      "Using cached transaction because the network request failed."
    );

    return cachedTransaction;
  }
}

/**
 * ============================================================================
 * Get Transactions
 * ============================================================================
 *
 * Backwards-compatible array API used by the current Transactions hook.
 */

export async function getTransactions(): Promise<Transaction[]> {
  const response = await getTransactionsPage(1, 20);

  return response.transactions;
}
