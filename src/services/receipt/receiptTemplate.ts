import { Transaction } from "@/types/transaction";

import { formatCurrency } from "@/utils/formatters/currency";
import { formatDateTime } from "@/utils/formatters/date";

export function receiptTemplate(transaction: Transaction) {
  const amount = formatCurrency(transaction.amount, {
    currency: transaction.currency,
  });

  const date = formatDateTime(
    new Date(transaction.createdAt)
  );

  const statusConfig = {
    paid: {
      label: "PAID",
      background: "#DCFCE7",
      color: "#15803D",
    },

    pending: {
      label: "PENDING",
      background: "#FEF3C7",
      color: "#D97706",
    },

    failed: {
      label: "FAILED",
      background: "#FEE2E2",
      color: "#B91C1C",
    },
  } as const;

  const status =
    statusConfig[transaction.status];

  const paymentChannelLabels = {
    bank: "Bank",
    card: "Card",
    qr: "QR Code",
    transfer: "Transfer",
    ussd: "USSD",
  } as const;

  const transactionType =
    transaction.type === "credit"
      ? "Credit"
      : "Debit";

  return `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8" />

<style>

body{
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
    background:#F9FAFB;
    color:#111827;
    padding:32px;
}

.receipt{

    max-width:680px;

    margin:auto;

    background:#FFFFFF;

    border:1px solid #E5E7EB;

    border-radius:16px;

    overflow:hidden;
}

.header{

    text-align:center;

    padding:32px;

    background:#E6F4E6;

    border-bottom:1px solid #CDE9CD;
}

.logo{

    font-size:28px;

    font-weight:700;

    color:#006F01;

    letter-spacing:1px;
}

.subtitle{

    margin-top:8px;

    color:#4B5563;

    font-size:15px;
}

.receipt-number{

    margin-top:24px;

    font-size:13px;

    color:#6B7280;
}

.reference{

    font-size:18px;

    font-weight:700;

    color:#111827;

    margin-top:4px;
}

.date{

    margin-top:16px;

    color:#4B5563;

    font-size:14px;
}

.status-container{

    text-align:center;

    padding-top:24px;
}

.status{

    display:inline-block;

    padding:10px 24px;

    border-radius:999px;

    font-size:14px;

    font-weight:700;

    letter-spacing:1px;
}

.section{

    padding:24px 32px;
}

.amount{

    font-size:42px;

    font-weight:700;

    color:#111827;

    text-align:center;
}

.divider{

    height:1px;

    background:#E5E7EB;
}

.section-title{

    font-size:18px;

    font-weight:700;

    color:#111827;

    margin-bottom:20px;
}

.row{

    display:flex;

    justify-content:space-between;

    align-items:center;

    padding:12px 0;

    border-bottom:1px solid #F3F4F6;
}

.row:last-child{

    border-bottom:none;
}

.label{

    color:#6B7280;

    font-size:14px;
}

.value{

    font-size:15px;

    font-weight:600;

    color:#111827;
}

</style>

</head>

<body>

<div class="receipt">

<div class="header">

<div class="logo">

XPRESSSTORE

</div>

<div class="subtitle">

Digital Payment Receipt

</div>

<div class="receipt-number">

Receipt Number

</div>

<div class="reference">

${transaction.reference}

</div>

<div class="date">

${date}

</div>

</div>

<div class="status-container">

<div
class="status"
style="
background:${status.background};
color:${status.color};
"
>

${status.label}

</div>

</div>

<div class="section">

<div class="amount">

${amount}

</div>

</div>

<div class="divider"></div>

<div class="section">

<div class="section-title">

Transaction Details

</div>

<div class="row">

<div class="label">

Reference

</div>

<div class="value">

${transaction.reference}

</div>

</div>

<div class="row">

<div class="label">

Payment Method

</div>

<div class="value">

${paymentChannelLabels[transaction.channel]}

</div>

</div>

<div class="row">

<div class="label">

Transaction Type

</div>

<div class="value">

${transactionType}

</div>

</div>

<div class="row">

<div class="label">

Status

</div>

<div
class="value"
style="
color:${status.color};
"
>

${status.label}

</div>

</div>

<div class="row">

<div class="label">

Date & Time

</div>

<div class="value">

${date}

</div>

</div>

</div>

<div class="divider"></div>

</div>

</body>

</html>
`;
}