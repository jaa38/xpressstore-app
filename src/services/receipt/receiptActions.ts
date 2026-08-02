import * as Sharing from "expo-sharing";

import {
  File,
  Paths,
} from "expo-file-system";

import { Transaction } from "@/types/transaction";

import { generateReceipt } from "./generateReceipt";

export async function shareReceipt(
  transaction: Transaction
) {
  const receipt = await generateReceipt(transaction);

  const available =
    await Sharing.isAvailableAsync();

  if (!available) {
    throw new Error(
      "Sharing is not available on this device."
    );
  }

  await Sharing.shareAsync(receipt.uri, {
    mimeType: "application/pdf",
    dialogTitle: "Share Receipt",
    UTI: "com.adobe.pdf",
  });
}

export async function downloadReceipt(
  transaction: Transaction
) {
  const receipt = await generateReceipt(transaction);

  const fileName = `Receipt-${transaction.reference}.pdf`;

  // Destination inside the app's Documents directory
  const destination = new File(
    Paths.document,
    fileName
  );

  // Copy the generated PDF
  const source = new File(receipt.uri);

  source.copy(destination);

  return destination.uri;
}