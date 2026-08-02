import * as Print from "expo-print";

import { Transaction } from "@/types/transaction";

import { receiptTemplate } from "./receiptTemplate";
import { getReceiptVerification } from "./receiptVerification";

export interface GeneratedReceipt {
  uri: string;
}

export async function generateReceipt(
  transaction: Transaction
): Promise<GeneratedReceipt> {
  const verification = getReceiptVerification(transaction);

  /**
   * Placeholder QR image.
   *
   * In the next phase this will be replaced with
   * a generated Base64 QR Code image.
   */
  const qrCodeDataUri = "";

  const html = receiptTemplate(
    transaction,
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