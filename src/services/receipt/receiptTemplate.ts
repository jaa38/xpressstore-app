import { Transaction } from "@/types/transaction";

import { formatCurrency } from "@/utils/formatters/currency";
import { formatDateTime } from "@/utils/formatters/date";

export function receiptTemplate(transaction: Transaction) {
  const amount = formatCurrency(transaction.amount, {
    currency: transaction.currency,
  });

  const date = formatDateTime(new Date(transaction.createdAt));

  const statusColors = {
    paid: "#16A34A",
    pending: "#D97706",
    failed: "#DC2626",
  } as const;

  const statusBackgrounds = {
    paid: "#DCFCE7",
    pending: "#FEF3C7",
    failed: "#FEE2E2",
  } as const;

  const paymentChannels = {
    bank: "Bank",
    card: "Card",
    qr: "QR Code",
    transfer: "Transfer",
    ussd: "USSD",
  };

  return `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8"/>

<style>

*{
    box-sizing:border-box;
}

body{

    margin:0;

    padding:32px;

    background:#F9FAFB;

    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;

    color:#111827;
}

.receipt{

    max-width:720px;

    margin:auto;

    background:#FFFFFF;

    border:1px solid #E5E7EB;

    border-radius:18px;

    overflow:hidden;
}

.header{

    padding:36px;

    text-align:center;

    background:#E6F4E6;

    border-bottom:1px solid #CDE9CD;
}

.logo{

    font-size:30px;

    font-weight:700;

    color:#006F01;

    letter-spacing:1px;
}

.subtitle{

    margin-top:8px;

    font-size:15px;

    color:#4B5563;
}

.receipt-number{

    margin-top:24px;

    font-size:13px;

    color:#6B7280;
}

.reference{

    margin-top:4px;

    font-size:20px;

    font-weight:700;

    color:#111827;
}

.date{

    margin-top:16px;

    font-size:14px;

    color:#4B5563;
}

.section{

    padding:28px 32px;
}

.status{

    display:inline-block;

    margin-bottom:24px;

    padding:8px 18px;

    border-radius:999px;

    font-size:13px;

    font-weight:700;

    color:${statusColors[transaction.status]};

    background:${statusBackgrounds[transaction.status]};
}

.amount{

    font-size:44px;

    font-weight:700;

    text-align:center;

    color:#111827;
}

.section-title{

    margin-bottom:20px;

    font-size:18px;

    font-weight:700;

    color:#111827;
}

.row{

    display:flex;

    justify-content:space-between;

    align-items:center;

    padding:14px 0;
}

.label{

    font-size:14px;

    color:#6B7280;
}

.value{

    font-size:15px;

    font-weight:600;

    color:#111827;

    text-align:right;
}

.divider{

    height:1px;

    background:#E5E7EB;
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

<div class="section" style="text-align:center;">

<div class="status">

${transaction.status.toUpperCase()}

</div>

<div class="amount">

${amount}

</div>

</div>

<div class="divider"></div>

<div class="section">

<div class="section-title">

Transaction Information

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

Payment Channel

</div>

<div class="value">

${paymentChannels[transaction.channel]}

</div>

</div>

<div class="row">

<div class="label">

Transaction Type

</div>

<div class="value">

${transaction.type === "credit" ? "Credit" : "Debit"}

</div>

</div>

<div class="row">

<div class="label">

Status

</div>

<div
class="value"
style="color:${statusColors[transaction.status]};"
>

${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}

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

<div class="section">

<div class="section-title">

Customer Information

</div>

<div class="row">

<div class="label">

Customer Name

</div>

<div class="value">

${transaction.customer}

</div>

</div>

</div>

<div class="divider"></div>

</div>

</body>

</html>
`;
}