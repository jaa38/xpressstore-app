import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

import { Order } from "@/types/order";

import { generateOrderReceipt } from "./generateOrderReceipt";

export async function shareOrderReceipt(order: Order) {
  const receipt = await generateOrderReceipt(order);

  const available = await Sharing.isAvailableAsync();

  if (!available) {
    throw new Error("Sharing is not available on this device.");
  }

  await Sharing.shareAsync(receipt.uri, {
    mimeType: "application/pdf",
    dialogTitle: "Share Receipt",
    UTI: "com.adobe.pdf",
  });
}

export async function downloadOrderReceipt(order: Order) {
  const receipt = await generateOrderReceipt(order);

  const fileName = `Order-${order.reference}.pdf`;

  const directory = new FileSystem.Directory(
    FileSystem.Paths.document,
    "Receipts"
  );

  if (!directory.exists) {
    directory.create();
  }

  const destination = new FileSystem.File(directory, fileName);

  await FileSystem.copyAsync({
    from: receipt.uri,
    to: destination.uri,
  });

  return destination.uri;
}

export async function printOrderReceipt(order: Order) {
  const receipt = await generateOrderReceipt(order);

  return receipt.uri;
}
