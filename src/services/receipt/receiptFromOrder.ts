import { Receipt } from "@/types/receipt";
import { Order } from "@/types/order";

export function receiptFromOrder(
  order: Order
): Receipt {
  return {
    id: order.id,

    reference: order.reference,

    customer: order.customerName,

    amount: order.total,

    currency: order.currency,

    channel: order.paymentChannel,

    /**
     * Orders don't have pending payments.
     * Only paid orders should generate receipts.
     */
    status: "paid",

    /**
     * Money received by the merchant.
     */
    type: "credit",

    createdAt: order.createdAt,
  };
}