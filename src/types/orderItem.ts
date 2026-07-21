import type { Currency } from "./currency";

export interface OrderItem {
  /**
   * Reference to the product in the catalog.
   */
  productId: string;

  /**
   * Snapshot of the product name at the time of purchase.
   */
  productName: string;

  /**
   * Number of units purchased.
   */
  quantity: number;

  /**
   * Price per unit at checkout.
   */
  unitPrice: number;

  /**
   * quantity × unitPrice
   */
  subtotal: number;

  /**
   * Currency used during the transaction.
   */
  currency: Currency;
}