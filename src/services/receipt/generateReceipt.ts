import * as Print from "expo-print";

import { Transaction } from "@/types/transaction";

import { receiptTemplate } from "./receiptTemplate";

export interface GeneratedReceipt {
  uri: string;
}

export async function generateReceipt(
  transaction: Transaction
): Promise<GeneratedReceipt> {
  const html = receiptTemplate(transaction);

  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  return {
    uri,
  };
}