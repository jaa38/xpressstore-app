import type { Currency } from "./currency";

export interface MerchantOrderDto {
  id: string;

  transactionReference: string;

  customerName: string;

  customerPhoneNumber: string;

  customerEmail?: string;

  totalAmount: number;

  currency: Currency;

  paymentChannel: string;

  orderStatus: string;

  createdDate: string;

  updatedDate?: string;

  items: MerchantOrderItemDto[];
}

export interface MerchantOrderItemDto {
  productId: number;

  productName: string;

  quantity: number;

  unitPrice: number;

  totalPrice: number;
}
