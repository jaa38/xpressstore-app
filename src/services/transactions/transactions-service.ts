import { graphqlRequest } from "@/api/graphql-client";

import { transactionRepository } from "@/repositories/transactions/sqliteTransactionRepository";

import { USE_MOCK_TRANSACTIONS } from "@/mocks/config";

import { MOCK_TRANSACTIONS } from "@/mocks/transactions";

import type { Currency } from "@/types/currency";
import type { Transaction } from "@/types/transaction";

/**
 * ============================================================================
 * GraphQL DTO
 * ============================================================================
 *
 * Matches the documented `transactions` GraphQL query.
 *
 * The general transaction API exposes:
 *
 * - status through paymentResponseCode/paymentResponseMessage
 * - customer information
 * - payment type
 * - amount
 * - references
 * - dates
 *
 * UI-specific concepts such as channel/type/amount ranges are not invented
 * as GraphQL filters here.
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

/**
 * ============================================================================
 * Transactions Page
 * ============================================================================
 */

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
 * Documented API Filters
 * ============================================================================
 *
 * These are the filters that belong to the transaction API contract.
 *
 * UI-only filters should not be added here unless the backend documentation
 * explicitly supports them.
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
 * The API does not expose a dedicated `status` field.
 *
 * Successful transactions are identified using paymentResponseCode `00`.
 * Non-successful responses are treated as failed.
 *
 * Pending remains a UI/domain status and is supported by the mock data.
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
 * Generic Pagination
 * ============================================================================
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

  return {
    transactions: paginatedTransactions,

    totalCount,

    pageNumber: safePage,

    pageSize: safeLimit,
  };
}

/**
 * ============================================================================
 * MOCK STATUS MAPPER
 * ============================================================================
 *
 * Maps the documented API status values to the application's Transaction
 * status values.
 *
 * Documented API-style values:
 *
 * - Successful
 * - Pending
 * - Failed
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
 * MOCK TRANSACTION PAGE
 * ============================================================================
 *
 * This deliberately follows the documented API contract rather than trying
 * to make every UI filter a server-side API filter.
 *
 * Supported here:
 *
 * - page
 * - limit
 * - status
 * - startDate
 * - endDate
 *
 * UI-specific filters such as:
 *
 * - channel
 * - type
 * - amount
 * - search
 *
 * remain client-side in the screen.
 */

function getMockTransactionsPage(
  page: number,
  limit: number,
  filter: Partial<TransactionFilter>
): TransactionsPage {
  let transactions = [...MOCK_TRANSACTIONS];

  /**
   * --------------------------------------------------------------------------
   * STATUS
   * --------------------------------------------------------------------------
   */

  if (filter.status) {
    transactions = transactions.filter((transaction) =>
      matchesMockStatus(transaction, filter.status as string)
    );
  }

  /**
   * --------------------------------------------------------------------------
   * START DATE
   * --------------------------------------------------------------------------
   */

  if (filter.startDate) {
    const startDate = new Date(filter.startDate);

    transactions = transactions.filter(
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

    transactions = transactions.filter(
      (transaction) => new Date(transaction.createdAt) <= endDate
    );
  }

  /**
   * --------------------------------------------------------------------------
   * PAGINATION
   * --------------------------------------------------------------------------
   */

  return paginateTransactions(transactions, page, limit);
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
  /**
   * ==========================================================================
   * MOCK MODE
   * ==========================================================================
   *
   * The screen does not know this is mock data.
   *
   * It receives the same TransactionsPage contract as the real API.
   */

  if (USE_MOCK_TRANSACTIONS) {
    return getMockTransactionsPage(page, limit, filter);
  }

  /**
   * ==========================================================================
   * REAL API
   * ==========================================================================
   */

  const requestFilter = buildTransactionFilter(filter);

  try {
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
     * Offline SQLite fallback
     * ------------------------------------------------------------------------
     */

    console.warn(
      "Failed to fetch transactions from API. Using local SQLite data.",
      error
    );

    const cachedTransactions = await transactionRepository.getTransactions();

    if (cachedTransactions.length === 0) {
      throw error;
    }

    return paginateTransactions(cachedTransactions, page, limit);
  }
}

/**
 * ============================================================================
 * Get Transaction By ID
 * ============================================================================
 */

export async function getTransactionById(
  transactionId: string
): Promise<Transaction> {
  /**
   * Mock mode
   */

  if (USE_MOCK_TRANSACTIONS) {
    const transaction = MOCK_TRANSACTIONS.find(
      (item) => item.id === transactionId
    );

    if (!transaction) {
      throw new Error("Transaction not found.");
    }

    return transaction;
  }

  /**
   * Real API
   */

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

    await transactionRepository.saveTransaction(transaction);

    return transaction;
  } catch (error) {
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
 * Backwards-compatible array API.
 */

export async function getTransactions(): Promise<Transaction[]> {
  const response = await getTransactionsPage(1, 20);

  return response.transactions;
}
