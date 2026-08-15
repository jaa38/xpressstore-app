import * as Sharing from "expo-sharing";
import * as Print from "expo-print";

import { Order } from "@/types/order";

import { generateReceipt } from "./generateReceipt";
import { receiptFromOrder } from "./receiptFromOrder";
import { saveReceiptPdf } from "./receiptStorage";

export async function shareOrderReceipt(order: Order) {
  const receipt = receiptFromOrder(order);

  const generatedReceipt = await generateReceipt(receipt);

  const available = await Sharing.isAvailableAsync();

  if (!available) {
    throw new Error(
      "Sharing is not available on this device."
    );
  }

  await Sharing.shareAsync(generatedReceipt.uri, {
    mimeType: "application/pdf",
    dialogTitle: "Share Receipt",
    UTI: "com.adobe.pdf",
  });
}

export async function downloadOrderReceipt(
  order: Order
): Promise<string> {
  const receipt = receiptFromOrder(order);

  const generatedReceipt = await generateReceipt(receipt);

  return saveReceiptPdf(
    generatedReceipt.uri,
    `Order-${order.reference}.pdf`
  );
}

export async function printOrderReceipt(order: Order) {
  const receipt = receiptFromOrder(order);

  const generatedReceipt = await generateReceipt(receipt);

  await Print.printAsync({
    uri: generatedReceipt.uri,
  });
}