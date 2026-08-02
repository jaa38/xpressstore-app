export interface Receipt {
  id: string;

  reference: string;

  customer: string;

  amount: number;

  currency: string;

  status: "paid" | "pending" | "failed";

  channel:
    | "card"
    | "bank"
    | "bankTransfer"
    | "nqr"
    | "ussd";

  createdAt: string;

  type: "credit" | "debit";
}