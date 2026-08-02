import * as Print from "expo-print";

import { Order } from "@/types/order";

import { generateReceiptVerification } from "./receiptVerification";
import { generateReceiptQrCode } from "./receiptQrCode";
import { orderReceiptTemplate } from "./orderReceiptTemplate";

export interface GeneratedOrderReceipt {
  uri: string;
}

export async function generateOrderReceipt(
  order: Order
): Promise<GeneratedOrderReceipt> {
  const verification =
    generateReceiptVerification(order.reference);

  const qrCodeDataUri =
    await generateReceiptQrCode(
      verification.verificationUrl
    );

  const html = orderReceiptTemplate(
    order,
    verification,
    qrCodeDataUri
  );

  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  return {
    uri,
  };
}