import type {
  Order,
  OrderStatus,
} from "@/types/order";

import type { OrderItem } from "@/types/orderItem";

import type { OrderStatusHistory } from "@/types/orderStatusHistory";

import type { Currency } from "@/types/currency";

import type { PaymentChannel } from "@/types/payment";

import { getDatabase } from "@/database";

import type { OrderRepository } from "./orderRepository";

/**
 * ============================================================================
 * SQLite Row Types
 * ============================================================================
 */

interface OrderRow {
  id: string;
  reference: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;

  delivery_street: string | null;
  delivery_city: string | null;
  delivery_state: string | null;
  delivery_country: string | null;
  delivery_postal_code: string | null;

  total: number;
  currency: string;
  payment_channel: string;
  status: string;

  created_at: string;
  updated_at: string | null;
  synced_at: number;
}

interface OrderItemRow {
  id: number;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  currency: string;
}

interface OrderStatusHistoryRow {
  id: string;
  order_id: string;
  status: string;
  created_at: string;
  updated_by: string;
  note: string | null;
}

/**
 * ============================================================================
 * Mapping Helpers
 * ============================================================================
 */

/**
 * Map a database currency value into the application's Currency type.
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
 * Map a database/API status into the application's OrderStatus type.
 */
function mapOrderStatus(value: string): OrderStatus {
  const normalized = value?.trim().toLowerCase() ?? "";

  switch (normalized) {
    case "delivered":
      return "delivered";

    case "returned":
    case "return":
      return "returned";

    case "failed":
    case "failure":
    case "declined":
    case "decline":
    case "abandoned":
      return "failed";

    case "paid":
    case "successful":
    case "success":
      return "paid";

    default:
      return "failed";
  }
}

/**
 * Map a database/API payment channel into the application's
 * PaymentChannel type.
 *
 * The application uses:
 *
 * - bank
 * - card
 * - bankTransfer
 * - nqr
 * - ussd
 *
 * API/database values such as "transfer" and "qr" are normalised
 * to the application's canonical values.
 */
function mapPaymentChannel(value: string): PaymentChannel {
  const normalized = value?.trim().toLowerCase() ?? "";

  switch (normalized) {
    case "card":
      return "card";

    case "bank":
      return "bank";

    case "banktransfer":
    case "bank_transfer":
    case "transfer":
      return "bankTransfer";

    case "nqr":
    case "qr":
      return "nqr";

    case "ussd":
      return "ussd";

    default:
      return "card";
  }
}

/**
 * Map an OrderItem database row into the UI/domain model.
 */
function mapOrderItemRow(
  row: OrderItemRow
): OrderItem {
  return {
    productId: row.product_id,

    productName: row.product_name,

    quantity: row.quantity,

    unitPrice: row.unit_price,

    subtotal: row.subtotal,

    currency: mapCurrency(row.currency),
  };
}

/**
 * Map an order status history row into the domain model.
 */
function mapOrderStatusHistoryRow(
  row: OrderStatusHistoryRow
): OrderStatusHistory {
  return {
    id: row.id,

    status: mapOrderStatus(row.status),

    createdAt: row.created_at,

    updatedBy: row.updated_by,

    note: row.note ?? undefined,
  };
}

/**
 * ============================================================================
 * SQLite Repository
 * ============================================================================
 */

class SQLiteOrderRepository
  implements OrderRepository
{
  /**
   * --------------------------------------------------------------------------
   * Get Orders
   * --------------------------------------------------------------------------
   */

  async getOrders(): Promise<Order[]> {
    const database = await getDatabase();

    const rows =
      await database.getAllAsync<OrderRow>(`
        SELECT
          id,
          reference,
          customer_name,
          customer_phone,
          customer_email,
          delivery_street,
          delivery_city,
          delivery_state,
          delivery_country,
          delivery_postal_code,
          total,
          currency,
          payment_channel,
          status,
          created_at,
          updated_at,
          synced_at
        FROM orders
        ORDER BY created_at DESC
      `);

    const orders = await Promise.all(
      rows.map((row) =>
        this.hydrateOrder(
          database,
          row
        )
      )
    );

    return orders;
  }

  /**
   * --------------------------------------------------------------------------
   * Get Order By ID
   * --------------------------------------------------------------------------
   */

  async getOrderById(
    id: string
  ): Promise<Order | null> {
    const database = await getDatabase();

    const row =
      await database.getFirstAsync<OrderRow>(
        `
          SELECT
            id,
            reference,
            customer_name,
            customer_phone,
            customer_email,
            delivery_street,
            delivery_city,
            delivery_state,
            delivery_country,
            delivery_postal_code,
            total,
            currency,
            payment_channel,
            status,
            created_at,
            updated_at,
            synced_at
          FROM orders
          WHERE id = ?
          LIMIT 1
        `,
        id
      );

    if (!row) {
      return null;
    }

    return this.hydrateOrder(
      database,
      row
    );
  }

  /**
   * --------------------------------------------------------------------------
   * Save Orders
   * --------------------------------------------------------------------------
   */

  async saveOrders(
    orders: Order[]
  ): Promise<void> {
    const database = await getDatabase();

    await database.withTransactionAsync(
      async () => {
        for (const order of orders) {
          await this.upsertOrder(
            database,
            order
          );
        }
      }
    );
  }

  /**
   * --------------------------------------------------------------------------
   * Save Order
   * --------------------------------------------------------------------------
   */

  async saveOrder(
    order: Order
  ): Promise<void> {
    const database = await getDatabase();

    await database.withTransactionAsync(
      async () => {
        await this.upsertOrder(
          database,
          order
        );
      }
    );
  }

  /**
   * --------------------------------------------------------------------------
   * Upsert Order
   * --------------------------------------------------------------------------
   */

  private async upsertOrder(
    database: Awaited<
      ReturnType<typeof getDatabase>
    >,
    order: Order
  ): Promise<void> {
    await database.runAsync(
      `
        INSERT INTO orders (
          id,
          reference,
          customer_name,
          customer_phone,
          customer_email,
          delivery_street,
          delivery_city,
          delivery_state,
          delivery_country,
          delivery_postal_code,
          total,
          currency,
          payment_channel,
          status,
          created_at,
          updated_at,
          synced_at
        )
        VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        )
        ON CONFLICT(id)
        DO UPDATE SET
          reference = excluded.reference,
          customer_name = excluded.customer_name,
          customer_phone = excluded.customer_phone,
          customer_email = excluded.customer_email,
          delivery_street = excluded.delivery_street,
          delivery_city = excluded.delivery_city,
          delivery_state = excluded.delivery_state,
          delivery_country = excluded.delivery_country,
          delivery_postal_code = excluded.delivery_postal_code,
          total = excluded.total,
          currency = excluded.currency,
          payment_channel = excluded.payment_channel,
          status = excluded.status,
          created_at = excluded.created_at,
          updated_at = excluded.updated_at,
          synced_at = excluded.synced_at
      `,
      order.id,
      order.reference,
      order.customerName,
      order.customerPhone,
      order.customerEmail ?? null,

      order.deliveryAddress?.street ?? null,
      order.deliveryAddress?.city ?? null,
      order.deliveryAddress?.state ?? null,
      order.deliveryAddress?.country ?? null,
      order.deliveryAddress?.postalCode ?? null,

      order.total,
      order.currency,
      order.paymentChannel,
      order.status,

      order.createdAt,
      order.updatedAt ?? null,

      Date.now()
    );

    /**
     * Replace child records.
     *
     * This ensures SQLite represents the latest server response
     * rather than accumulating stale order items/history.
     */

    await database.runAsync(
      `
        DELETE FROM order_items
        WHERE order_id = ?
      `,
      order.id
    );

    await database.runAsync(
      `
        DELETE FROM order_status_history
        WHERE order_id = ?
      `,
      order.id
    );

    /**
     * Order items.
     */

    for (
      let index = 0;
      index < order.items.length;
      index += 1
    ) {
      const item = order.items[index];

      if (!item) {
        continue;
      }

      await database.runAsync(
        `
          INSERT INTO order_items (
            order_id,
            product_id,
            product_name,
            quantity,
            unit_price,
            subtotal,
            currency
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        order.id,
        item.productId,
        item.productName,
        item.quantity,
        item.unitPrice,
        item.subtotal,
        item.currency
      );
    }

    /**
     * Order status history.
     */

    for (
      let index = 0;
      index < order.statusHistory.length;
      index += 1
    ) {
      const history =
        order.statusHistory[index];

      if (!history) {
        continue;
      }

      await database.runAsync(
        `
          INSERT INTO order_status_history (
            id,
            order_id,
            status,
            created_at,
            updated_by,
            note
          )
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        history.id,
        order.id,
        history.status,
        history.createdAt,
        history.updatedBy,
        history.note ?? null
      );
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Hydrate Order
   * --------------------------------------------------------------------------
   */

  private async hydrateOrder(
    database: Awaited<
      ReturnType<typeof getDatabase>
    >,
    row: OrderRow
  ): Promise<Order> {
    const itemRows =
      await database.getAllAsync<OrderItemRow>(
        `
          SELECT
            id,
            order_id,
            product_id,
            product_name,
            quantity,
            unit_price,
            subtotal,
            currency
          FROM order_items
          WHERE order_id = ?
          ORDER BY id ASC
        `,
        row.id
      );

    const historyRows =
      await database.getAllAsync<OrderStatusHistoryRow>(
        `
          SELECT
            id,
            order_id,
            status,
            created_at,
            updated_by,
            note
          FROM order_status_history
          WHERE order_id = ?
          ORDER BY created_at ASC
        `,
        row.id
      );

    const deliveryAddress =
      row.delivery_street !== null ||
      row.delivery_city !== null ||
      row.delivery_state !== null ||
      row.delivery_country !== null ||
      row.delivery_postal_code !== null
        ? {
            street:
              row.delivery_street ?? "",

            city:
              row.delivery_city ?? "",

            state:
              row.delivery_state ?? "",

            country:
              row.delivery_country ?? "",

            ...(row.delivery_postal_code
              ? {
                  postalCode:
                    row.delivery_postal_code,
                }
              : {}),
          }
        : undefined;

    return {
      id: row.id,

      reference: row.reference,

      customerName:
        row.customer_name,

      customerPhone:
        row.customer_phone,

      customerEmail:
        row.customer_email ??
        undefined,

      deliveryAddress,

      total: row.total,

      currency:
        mapCurrency(row.currency),

      items:
        itemRows.map(
          mapOrderItemRow
        ),

      paymentChannel:
        mapPaymentChannel(
          row.payment_channel
        ),

      status:
        mapOrderStatus(row.status),

      createdAt:
        row.created_at,

      updatedAt:
        row.updated_at ??
        undefined,

      statusHistory:
        historyRows.map(
          mapOrderStatusHistoryRow
        ),
    };
  }

  /**
   * --------------------------------------------------------------------------
   * Delete Order
   * --------------------------------------------------------------------------
   */

  async deleteOrder(
    id: string
  ): Promise<void> {
    const database = await getDatabase();

    await database.runAsync(
      `
        DELETE FROM orders
        WHERE id = ?
      `,
      id
    );
  }

  /**
   * --------------------------------------------------------------------------
   * Clear Orders
   * --------------------------------------------------------------------------
   */

  async clearOrders(): Promise<void> {
    const database = await getDatabase();

    await database.runAsync(`
      DELETE FROM orders
    `);
  }
}

/**
 * ============================================================================
 * Repository Instance
 * ============================================================================
 */

export const orderRepository =
  new SQLiteOrderRepository();