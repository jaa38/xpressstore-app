import * as Sharing from "expo-sharing";

import { Transaction } from "@/types/transaction";

import { generateReceipt } from "./generateReceipt";
import { receiptFromTransaction } from "./receiptFromTransaction";
import { saveReceiptPdf } from "./receiptStorage";

/**
 * ---------------------------------------------------------------------------
 * Share Transaction Receipt
 * ---------------------------------------------------------------------------
 *
 * Generates the transaction receipt as a PDF and opens the native
 * sharing interface.
 */
export async function shareReceipt(transaction: Transaction) {
  const receipt = receiptFromTransaction(transaction);

  const generatedReceipt = await generateReceipt(receipt);

  const available = await Sharing.isAvailableAsync();

  if (!available) {
    throw new Error("Sharing is not available on this device.");
  }

  await Sharing.shareAsync(generatedReceipt.uri, {
    mimeType: "application/pdf",
    dialogTitle: "Share Receipt",
    UTI: "com.adobe.pdf",
  });
}

/**
 * ---------------------------------------------------------------------------
 * Download Transaction Receipt
 * ---------------------------------------------------------------------------
 *
 * Generates the transaction receipt as a PDF and saves it locally inside
 * the application's Receipts directory.
 *
 * The saved URI is returned to the caller so the UI can confirm where
 * the receipt was stored.
 */
export async function downloadReceipt(
  transaction: Transaction
): Promise<string> {
  const receipt = receiptFromTransaction(transaction);

  const generatedReceipt = await generateReceipt(receipt);

  return saveReceiptPdf(
    generatedReceipt.uri,
    `Transaction-${transaction.reference}.pdf`
  );
}
