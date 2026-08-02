import * as Sharing from "expo-sharing";

import { Transaction } from "@/types/transaction";

import { generateReceipt } from "./generateReceipt";
import { receiptFromTransaction } from "./receiptFromTransaction";

export async function shareReceipt(
  transaction: Transaction
) {
  const receipt = receiptFromTransaction(transaction);

  const generatedReceipt =
    await generateReceipt(receipt);

  const available =
    await Sharing.isAvailableAsync();

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

export async function downloadReceipt(
  transaction: Transaction
) {
  const receipt = receiptFromTransaction(transaction);

  const generatedReceipt =
    await generateReceipt(receipt);

  const available =
    await Sharing.isAvailableAsync();

  if (!available) {
    throw new Error(
      "File sharing is not available on this device."
    );
  }

  await Sharing.shareAsync(generatedReceipt.uri, {
    mimeType: "application/pdf",
    dialogTitle: "Save Receipt",
    UTI: "com.adobe.pdf",
  });
}