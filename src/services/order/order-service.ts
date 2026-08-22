import { apiClient } from "@/api/client";
import { graphqlRequest } from "@/api/graphql-client";
import { API_ENDPOINTS } from "@/api/endpoints";

import type { ApiResponse } from "@/types/api";
import type { Order } from "@/types/order";
import type { Currency } from "@/types/currency";

import { orderRepository } from "@/repositories/orders/sqliteOrderRepository";

import { USE_MOCK_ORDERS } from "@/mocks/config";
import { updateMockOrderStatus } from "@/mocks/orders";

/**
 * ============================================================================
 * GRAPHQL DTOs
 * ============================================================================
 *
 * These types represent the fields documented by the XpressStore
 * storeTransactions GraphQL query.
 */

/**
 * ---------------------------------------------------------------------------
 * Product
 * ---------------------------------------------------------------------------
 */

interface StoreTransactionProductDto {
  id: number;

  productName: string;

  quantity: number;

  amount: number;

  isLiked: boolean;

  rating: number;

  comment: string;
}

/**
 * ---------------------------------------------------------------------------
 * Discount
 * ---------------------------------------------------------------------------
 */

interface StoreTransactionDiscountDto {
  code: string;

  discountAmount: number;
}

/**
 * ---------------------------------------------------------------------------
 * Delivery
 * ---------------------------------------------------------------------------
 */

interface StoreTransactionDeliveryDto {
  customerAddress: string;

  deliveryFee: number;

  region: string;
}

/**
 * ---------------------------------------------------------------------------
 * Store Transaction
 * ---------------------------------------------------------------------------
 */

interface StoreTransactionDto {
  id: number;

  firstName: string;

  lastName: string;

  email: string;

  phoneNumber: string;

  customerAddress: string;

  city: string;

  currency: string;

  country: string;

  deliveryNotes: string;

  isBeneficiary: boolean;

  totalAmount: number;

  dateCreated: string;

  storeName: string;

  dateUpdated: string;

  isDelivered: boolean;

  isSuccessful: boolean;

  transactionId: string;

  status: string;

  paymentResponseMessage: string;

  productDescription: string;

  paymentDate: string;

  paymentReference: string;

  metaData: string | null;

  merchantId: string;

  discount: StoreTransactionDiscountDto | null;

  deliveryDetails: StoreTransactionDeliveryDto | null;

  productPurchased: StoreTransactionProductDto[];
}

/**
 * ---------------------------------------------------------------------------
 * GraphQL Result
 * ---------------------------------------------------------------------------
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
 * GRAPHQL QUERY
 * ============================================================================
 *
 * Source:
 * 11_graphql.md
 *
 * storeTransactions returns paginated store orders.
 */

const STORE_TRANSACTIONS_QUERY = `
  query StoreTransactions(
    $page: Int!
    $limit: Int!
    $filter: TransactionFilterInput!
  ) {
    storeTransactions(
      page: $page
      limit: $limit
      filter: $filter
    ) {
      items {
        id
        firstName
        lastName
        email
        phoneNumber
        customerAddress
        city
        currency
        country
        deliveryNotes
        isBeneficiary
        totalAmount
        dateCreated
        storeName
        dateUpdated
        isDelivered
        isSuccessful
        transactionId
        status
        paymentResponseMessage
        productDescription
        paymentDate
        paymentReference
        metaData
        merchantId

        discount {
          code
          discountAmount
        }

        deliveryDetails {
          customerAddress
          deliveryFee
          region
        }

        productPurchased {
          id
          productName
          quantity
          amount
          isLiked
          rating
          comment
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
 * GRAPHQL FILTER
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
 * We therefore try to extract it from metaData when the backend provides it.
 *
 * If no usable value is available, the application falls back to "card"
 * because the existing Order model requires a paymentChannel.
 *
 * This fallback should be revisited if the backend exposes a dedicated
 * payment method field.
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
      value === "ussd" ||
      value === "wallet"
    ) {
      return value;
    }
  } catch {
    // Metadata is optional and may not contain valid JSON.
  }

  return "card";
}

/**
 * ============================================================================
 * ORDER MAPPER
 * ============================================================================
 */

function mapOrder(transaction: StoreTransactionDto): Order {
  const customerName = [transaction.firstName, transaction.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  const items =
    transaction.productPurchased?.map((product) => ({
      productId: String(product.id),

      productName: product.productName,

      quantity: Number(product.quantity),

      unitPrice: Number(product.amount),

      subtotal: Number(product.amount) * Number(product.quantity),

      currency: mapCurrency(transaction.currency),
    })) ?? [];

  const deliveryAddress = transaction.deliveryDetails;

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
 * CURRENCY MAPPER
 * ============================================================================
 */

function mapCurrency(value: string): Currency {
  switch (value?.toUpperCase()) {
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
 * GET ORDERS PAGE
 * ============================================================================
 *
 * GraphQL:
 *
 * storeTransactions
 *
 * The API supports pagination through:
 *
 * page
 * limit
 *
 * The response includes:
 *
 * totalCount
 * pageNumber
 * pageSize
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
    const response = await graphqlRequest<StoreTransactionsResult>({
      query: STORE_TRANSACTIONS_QUERY,

      variables: {
        page,

        limit,

        filter,
      },
    });

    const orders = response.storeTransactions.items.map(mapOrder);

    /**
     * Persist the latest server response locally.
     */
    await orderRepository.saveOrders(orders);

    return {
      orders,

      totalCount: response.storeTransactions.totalCount,

      pageNumber: response.storeTransactions.pageNumber,

      pageSize: response.storeTransactions.pageSize,
    };
  } catch (error) {
    /**
     * -----------------------------------------------------------------------
     * OFFLINE FALLBACK
     * -----------------------------------------------------------------------
     *
     * If the API is unavailable, use the locally persisted orders.
     *
     * The repository returns orders sorted newest-first, so we can reproduce
     * the server-side pagination locally.
     */

    const cachedOrders = await orderRepository.getOrders();

    if (cachedOrders.length === 0) {
      throw error;
    }

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
 * Uses the transactionId filter documented by the
 * XpressStore GraphQL API.
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
    const response = await graphqlRequest<StoreTransactionsResult>({
      query: STORE_TRANSACTIONS_QUERY,

      variables: {
        page: 1,

        limit: 1,

        filter,
      },
    });

    const transaction = response.storeTransactions.items[0];

    if (!transaction) {
      throw new Error("Order not found.");
    }

    const order = mapOrder(transaction);

    /**
     * Persist the latest server response locally.
     */
    await orderRepository.saveOrder(order);

    return order;
  } catch (error) {
    /**
     * -----------------------------------------------------------------------
     * OFFLINE FALLBACK
     * -----------------------------------------------------------------------
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
 */

export async function updateOrderDelivery(
  transactionId: string,
  isDelivery: boolean
): Promise<void> {
  await apiClient.post<ApiResponse<null>>(
    API_ENDPOINTS.store.toggleDelivery(transactionId, isDelivery)
  );

  /**
   * -------------------------------------------------------------------------
   * KEEP LOCAL ORDER CACHE CONSISTENT
   * -------------------------------------------------------------------------
   *
   * The documented Store API only exposes the delivery toggle.
   * It does not return the updated order, so we update the locally
   * persisted order using the requested delivery state.
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
 * -----------
 * Updates the local mock order without making an API request.
 *
 * API MODE
 * --------
 * Uses the documented XpressStore API.
 *
 * The documented API currently provides ToggleDelivery for moving
 * an order to delivered.
 */

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<void> {
  /**
   * -------------------------------------------------------------------------
   * MOCK MODE
   * -------------------------------------------------------------------------
   *
   * Keep mock data active when USE_MOCK_ORDERS is true.
   *
   * No API request is made.
   */

  if (USE_MOCK_ORDERS) {
    updateMockOrderStatus(orderId, status);

    return;
  }

  /**
   * -------------------------------------------------------------------------
   * API MODE
   * -------------------------------------------------------------------------
   */

  if (status === "delivered") {
    await updateOrderDelivery(orderId, true);

    return;
  }

  throw new Error(
    `The Xpress API does not currently document an endpoint for changing an order to "${status}".`
  );
}
