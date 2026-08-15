import { graphqlRequest } from "@/api/graphql-client";

import type { Currency } from "@/types/currency";
import type { Transaction } from "@/types/transaction";

/**
 * ---------------------------------------------------------------------------
 * GraphQL DTO
 * ---------------------------------------------------------------------------
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
 * ---------------------------------------------------------------------------
 * GraphQL Query
 * ---------------------------------------------------------------------------
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
 * ---------------------------------------------------------------------------
 * GraphQL Filter
 * ---------------------------------------------------------------------------
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
 * ---------------------------------------------------------------------------
 * Status Mapper
 * ---------------------------------------------------------------------------
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
 * ---------------------------------------------------------------------------
 * Payment Channel Mapper
 * ---------------------------------------------------------------------------
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
 * ---------------------------------------------------------------------------
 * Currency Mapper
 * ---------------------------------------------------------------------------
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
 * ---------------------------------------------------------------------------
 * Transaction Mapper
 * ---------------------------------------------------------------------------
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
 * ---------------------------------------------------------------------------
 * Get Transactions Page
 * ---------------------------------------------------------------------------
 */

export async function getTransactionsPage(
  page = 1,
  limit = 20,
  filter: Partial<TransactionFilter> = {}
): Promise<TransactionsPage> {
  const requestFilter: TransactionFilter = {
    customerEmail: filter.customerEmail ?? null,

    reference: filter.reference ?? null,

    transactionId: filter.transactionId ?? null,

    startDate: filter.startDate ?? null,

    endDate: filter.endDate ?? null,

    cardBrand: filter.cardBrand ?? null,

    paymentMethod: filter.paymentMethod ?? null,

    status: filter.status ?? null,
  };

  const response = await graphqlRequest<TransactionsResult>({
    query: TRANSACTIONS_QUERY,

    variables: {
      page,

      limit,

      filter: requestFilter,
    },
  });

  return {
    transactions: response.transactions.items.map(mapTransaction),

    totalCount: response.transactions.totalCount,

    pageNumber: response.transactions.pageNumber,

    pageSize: response.transactions.pageSize,
  };
}

/**
 * ---------------------------------------------------------------------------
 * Get Transaction By ID
 * ---------------------------------------------------------------------------
 *
 * Uses the documented GraphQL `transactionId` filter to retrieve a single
 * transaction.
 *
 * This is preferable to searching the currently loaded transaction page
 * because the requested transaction may not exist on the first page.
 */

export async function getTransactionById(
  transactionId: string
): Promise<Transaction> {
  const response = await getTransactionsPage(1, 1, {
    transactionId,
  });

  const transaction = response.transactions[0];

  if (!transaction) {
    throw new Error("Transaction not found.");
  }

  return transaction;
}

/**
 * ---------------------------------------------------------------------------
 * Get Transactions
 * ---------------------------------------------------------------------------
 *
 * Backwards-compatible array API used by the current
 * Transactions hook.
 */

export async function getTransactions(): Promise<Transaction[]> {
  const response = await getTransactionsPage(1, 20);

  return response.transactions;
}
