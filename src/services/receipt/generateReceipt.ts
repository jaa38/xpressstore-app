import * as Print from "expo-print";

import { Receipt } from "@/types/receipt";

import { receiptTemplate } from "./receiptTemplate";
import { getReceiptVerification } from "./receiptVerification";

export interface GeneratedReceipt {
  uri: string;
}

export async function generateReceipt(
  receipt: Receipt
): Promise<GeneratedReceipt> {
  const verification =
    getReceiptVerification(receipt);

  /**
   * Placeholder QR image.
   *
   * This will be replaced with a generated
   * Base64 QR code in a later phase.
   */
  const qrCodeDataUri = "";

  const html = receiptTemplate(
    receipt,
    verification,
    qrCodeDataUri
  );

  const { uri } =
    await Print.printToFileAsync({
      html,
      base64: false,
    });

  return {
    uri,
  };
}