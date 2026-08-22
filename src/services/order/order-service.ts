// src/services/order/order-service.ts

import { graphqlRequest } from "@/api/graphql-client";

import { API_ENDPOINTS } from "@/api/endpoints";

import { apiClient } from "@/api/client";

import { orderRepository } from "@/repositories/orders/sqliteOrderRepository";

import { USE_MOCK_ORDERS } from "@/mocks/config";

import { updateMockOrderStatus } from "@/mocks/orders";

import type { ApiResponse } from "@/types/api";

import type { Currency } from "@/types/currency";

import type { Order } from "@/types/order";

import type { PaymentChannel } from "@/types/payment";

/**
 * ============================================================================
 * STORE TRANSACTION DTO
 * ============================================================================
 *
 * Represents the response returned by the documented
 * `storeTransactions` GraphQL query.
 * ============================================================================
 */

interface StoreTransactionProductDto {
  id: number;

  productName: string;

  quantity: number;

  amount: number;
}

interface StoreTransactionDeliveryDetailsDto {
  customerAddress?: string;

  region?: string;
}

interface StoreTransactionDto {
  transactionId: string;

  paymentReference?: string;

  firstName?: string;

  lastName?: string;

  phoneNumber?: string;

  email?: string;

  customerAddress?: string;

  city?: string;

  country?: string;

  currency: string;

  totalAmount: number;

  dateCreated: string;

  dateUpdated?: string;

  isSuccessful: boolean;

  isDelivered: boolean;

  status?: string;

  metaData?: string | Record<string, unknown> | null;

  productPurchased?: StoreTransactionProductDto[];

  deliveryDetails?: StoreTransactionDeliveryDetailsDto;
}

/**
 * ============================================================================
 * STORE TRANSACTIONS RESULT
 * ============================================================================
 */

interface StoreTransactionsResult {
  storeTransactions: {
    items: StoreTransactionDto[];

    totalCount: number;

    pageNumber: number;

    pageSize: number;
  };
}

/**
 * ============================================================================
 * ORDERS PAGE
 * ============================================================================
 */

export interface OrdersPage {
  orders: Order[];

  totalCount: number;

  pageNumber: number;

  pageSize: number;
}

/**
 * ============================================================================
 * STORE TRANSACTIONS GRAPHQL QUERY
 * ============================================================================
 *
 * Retrieves merchant store transactions which are mapped into the
 * application's Order domain model.
 * ============================================================================
 */

const STORE_TRANSACTIONS_QUERY = `
  query StoreTransactions(
    $page: Int!
    $limit: Int!
    $filter: StoreTransactionFilterInput!
  ) {
    storeTransactions(
      page: $page
      limit: $limit
      filter: $filter
    ) {
      items {
        transactionId
        paymentReference
        firstName
        lastName
        phoneNumber
        email
        customerAddress
        city
        country
        currency
        totalAmount
        dateCreated
        dateUpdated
        isSuccessful
        isDelivered
        status
        metaData

        productPurchased {
          id
          productName
          quantity
          amount
        }

        deliveryDetails {
          customerAddress
          region
        }
      }

      totalCount
      pageNumber
      pageSize
    }
  }
`;

/**
 * ============================================================================
 * STORE TRANSACTION FILTER
 * ============================================================================
 */

interface StoreTransactionFilter {
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
 * ORDER STATUS MAPPER
 * ============================================================================
 *
 * The GraphQL response exposes:
 *
 * - isSuccessful
 * - isDelivered
 * - status
 *
 * The application currently uses:
 *
 * - paid
 * - delivered
 * - failed
 * - returned
 *
 * Delivery takes precedence because the API exposes isDelivered directly.
 * ============================================================================
 */

function mapOrderStatus(transaction: StoreTransactionDto): Order["status"] {
  if (transaction.isDelivered) {
    return "delivered";
  }

  const status = transaction.status?.trim().toLowerCase() ?? "";

  if (status.includes("return")) {
    return "returned";
  }

  if (
    status.includes("fail") ||
    status.includes("declin") ||
    status.includes("abandon")
  ) {
    return "failed";
  }

  if (transaction.isSuccessful) {
    return "paid";
  }

  return "failed";
}

/**
 * ============================================================================
 * PAYMENT CHANNEL MAPPER
 * ============================================================================
 *
 * The documented storeTransactions GraphQL response does not expose a
 * dedicated paymentChannel/paymentType field.
 *
 * We therefore try to extract the payment channel from metaData when
 * available.
 *
 * Supported application payment channels:
 *
 * - bank
 * - card
 * - bankTransfer
 * - nqr
 * - ussd
 *
 * If no usable value is available, the application falls back to "card"
 * because the existing Order model requires a paymentChannel.
 * ============================================================================
 */

function mapPaymentChannel(
  transaction: StoreTransactionDto
): Order["paymentChannel"] {
  if (!transaction.metaData) {
    return "card";
  }

  try {
    const metadata =
      typeof transaction.metaData === "string"
        ? JSON.parse(transaction.metaData)
        : transaction.metaData;

    const value =
      metadata?.paymentChannel ??
      metadata?.paymentMethod ??
      metadata?.paymentType;

    if (
      value === "card" ||
      value === "bank" ||
      value === "bankTransfer" ||
      value === "nqr" ||
      value === "ussd"
    ) {
      return value;
    }
  } catch {
    /**
     * Metadata is optional and may not contain valid JSON.
     */
  }

  return "card";
}

/**
 * ============================================================================
 * CURRENCY MAPPER
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
 * ORDER MAPPER
 * ============================================================================
 */

function mapOrder(transaction: StoreTransactionDto): Order {
  /**
   * --------------------------------------------------------------------------
   * CUSTOMER NAME
   * --------------------------------------------------------------------------
   */

  const customerName = [transaction.firstName, transaction.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  /**
   * --------------------------------------------------------------------------
   * ORDER ITEMS
   * --------------------------------------------------------------------------
   */

  const items =
    transaction.productPurchased?.map((product) => ({
      productId: String(product.id),

      productName: product.productName,

      quantity: Number(product.quantity),

      unitPrice: Number(product.amount),

      subtotal: Number(product.amount) * Number(product.quantity),

      currency: mapCurrency(transaction.currency),
    })) ?? [];

  /**
   * --------------------------------------------------------------------------
   * DELIVERY ADDRESS
   * --------------------------------------------------------------------------
   */

  const deliveryAddress = transaction.deliveryDetails;

  /**
   * --------------------------------------------------------------------------
   * DOMAIN ORDER
   * --------------------------------------------------------------------------
   */

  return {
    id: transaction.transactionId,

    reference: transaction.paymentReference || transaction.transactionId,

    customerName: customerName || "Unknown Customer",

    customerPhone: transaction.phoneNumber ?? "",

    customerEmail: transaction.email ?? "",

    deliveryAddress: {
      street:
        deliveryAddress?.customerAddress ?? transaction.customerAddress ?? "",

      city: transaction.city ?? "",

      state: deliveryAddress?.region ?? "",

      country: transaction.country ?? "",
    },

    items,

    total: Number(transaction.totalAmount),

    currency: mapCurrency(transaction.currency),

    paymentChannel: mapPaymentChannel(transaction),

    status: mapOrderStatus(transaction),

    statusHistory: [],

    createdAt: transaction.dateCreated,

    updatedAt: transaction.dateUpdated || transaction.dateCreated,
  };
}

/**
 * ============================================================================
 * GET ORDERS PAGE
 * ============================================================================
 *
 * GraphQL:
 *
 * storeTransactions
 *
 * The API supports pagination through:
 *
 * - page
 * - limit
 *
 * The response includes:
 *
 * - totalCount
 * - pageNumber
 * - pageSize
 * ============================================================================
 */

export async function getOrdersPage(page = 1, limit = 20): Promise<OrdersPage> {
  const filter: StoreTransactionFilter = {
    customerEmail: null,

    reference: null,

    transactionId: null,

    startDate: null,

    endDate: null,

    cardBrand: null,

    paymentMethod: null,

    status: null,
  };

  try {
    /**
     * ------------------------------------------------------------------------
     * API REQUEST
     * ------------------------------------------------------------------------
     */

    const response = await graphqlRequest<StoreTransactionsResult>({
      query: STORE_TRANSACTIONS_QUERY,

      variables: {
        page,

        limit,

        filter,
      },
    });

    /**
     * ------------------------------------------------------------------------
     * MAP API ORDERS
     * ------------------------------------------------------------------------
     */

    const orders = response.storeTransactions.items.map(mapOrder);

    /**
     * ------------------------------------------------------------------------
     * PERSIST API RESPONSE
     * ------------------------------------------------------------------------
     */

    await orderRepository.saveOrders(orders);

    /**
     * ------------------------------------------------------------------------
     * RETURN PAGINATED RESULT
     * ------------------------------------------------------------------------
     */

    return {
      orders,

      totalCount: response.storeTransactions.totalCount,

      pageNumber: response.storeTransactions.pageNumber,

      pageSize: response.storeTransactions.pageSize,
    };
  } catch (error) {
    /**
     * ------------------------------------------------------------------------
     * OFFLINE FALLBACK
     * ------------------------------------------------------------------------
     *
     * If the API is unavailable, use the locally persisted orders.
     *
     * The repository returns orders sorted newest-first, so we reproduce
     * server-side pagination locally.
     */

    const cachedOrders = await orderRepository.getOrders();

    if (cachedOrders.length === 0) {
      throw error;
    }

    /**
     * ------------------------------------------------------------------------
     * LOCAL PAGINATION
     * ------------------------------------------------------------------------
     */

    const startIndex = (page - 1) * limit;

    const endIndex = startIndex + limit;

    const orders = cachedOrders.slice(startIndex, endIndex);

    return {
      orders,

      totalCount: cachedOrders.length,

      pageNumber: page,

      pageSize: limit,
    };
  }
}

/**
 * ============================================================================
 * GET ORDER BY ID
 * ============================================================================
 *
 * Uses the transactionId filter documented by the XpressStore GraphQL API.
 * ============================================================================
 */

export async function getOrderById(id: string): Promise<Order> {
  const filter: StoreTransactionFilter = {
    customerEmail: null,

    reference: null,

    transactionId: id,

    startDate: null,

    endDate: null,

    cardBrand: null,

    paymentMethod: null,

    status: null,
  };

  try {
    /**
     * ------------------------------------------------------------------------
     * API REQUEST
     * ------------------------------------------------------------------------
     */

    const response = await graphqlRequest<StoreTransactionsResult>({
      query: STORE_TRANSACTIONS_QUERY,

      variables: {
        page: 1,

        limit: 1,

        filter,
      },
    });

    /**
     * ------------------------------------------------------------------------
     * FIND ORDER
     * ------------------------------------------------------------------------
     */

    const transaction = response.storeTransactions.items[0];

    if (!transaction) {
      throw new Error("Order not found.");
    }

    /**
     * ------------------------------------------------------------------------
     * MAP ORDER
     * ------------------------------------------------------------------------
     */

    const order = mapOrder(transaction);

    /**
     * ------------------------------------------------------------------------
     * PERSIST LATEST SERVER RESPONSE
     * ------------------------------------------------------------------------
     */

    await orderRepository.saveOrder(order);

    return order;
  } catch (error) {
    /**
     * ------------------------------------------------------------------------
     * OFFLINE FALLBACK
     * ------------------------------------------------------------------------
     */

    const cachedOrder = await orderRepository.getOrderById(id);

    if (!cachedOrder) {
      throw error;
    }

    return cachedOrder;
  }
}

/**
 * ============================================================================
 * UPDATE ORDER DELIVERY
 * ============================================================================
 *
 * REST:
 *
 * POST /Store/ToggleDelivery
 *
 * IsDelivery=true
 *     -> delivered
 *
 * IsDelivery=false
 *     -> undelivered
 *
 * TransactionId
 *     -> store transaction ID
 * ============================================================================
 */

export async function updateOrderDelivery(
  transactionId: string,
  isDelivery: boolean
): Promise<void> {
  /**
   * --------------------------------------------------------------------------
   * API REQUEST
   * --------------------------------------------------------------------------
   */

  await apiClient.post<ApiResponse<null>>(
    API_ENDPOINTS.store.toggleDelivery(transactionId, isDelivery)
  );

  /**
   * --------------------------------------------------------------------------
   * KEEP LOCAL ORDER CACHE CONSISTENT
   * --------------------------------------------------------------------------
   *
   * The documented Store API only exposes the delivery toggle.
   *
   * It does not return the updated order, so we update the locally persisted
   * order using the requested delivery state.
   */

  const cachedOrder = await orderRepository.getOrderById(transactionId);

  if (!cachedOrder) {
    return;
  }

  const updatedOrder: Order = {
    ...cachedOrder,

    status: isDelivery ? "delivered" : cachedOrder.status,

    updatedAt: new Date().toISOString(),
  };

  await orderRepository.saveOrder(updatedOrder);
}

/**
 * ============================================================================
 * UPDATE ORDER STATUS
 * ============================================================================
 *
 * MOCK MODE
 * ----------
 * Updates the local mock order without making an API request.
 *
 * API MODE
 * --------
 * Uses the documented XpressStore API.
 *
 * The documented API currently provides ToggleDelivery for moving
 * an order to delivered.
 * ============================================================================
 */

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<void> {
  /**
   * --------------------------------------------------------------------------
   * MOCK MODE
   * --------------------------------------------------------------------------
   */

  if (USE_MOCK_ORDERS) {
    updateMockOrderStatus(orderId, status);

    return;
  }

  /**
   * --------------------------------------------------------------------------
   * API MODE
   * --------------------------------------------------------------------------
   */

  if (status === "delivered") {
    await updateOrderDelivery(orderId, true);

    return;
  }

  /**
   * --------------------------------------------------------------------------
   * UNSUPPORTED API STATUS
   * --------------------------------------------------------------------------
   */

  throw new Error(
    `The Xpress API does not currently document an endpoint for changing an order to "${status}".`
  );
}
