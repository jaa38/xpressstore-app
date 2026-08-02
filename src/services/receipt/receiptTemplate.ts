import { Transaction } from "@/types/transaction";

import { formatCurrency } from "@/utils/formatters/currency";
import { formatDateTime } from "@/utils/formatters/date";

export function receiptTemplate(transaction: Transaction) {
  const amount = formatCurrency(transaction.amount, {
    currency: transaction.currency,
  });

  const date = formatDateTime(new Date(transaction.createdAt));

  const processingFee = formatCurrency(0, {
    currency: transaction.currency,
  });

  const vat = formatCurrency(0, {
    currency: transaction.currency,
  });

  const total = amount;

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

    border-radius:18px;

    overflow:hidden;

    border:1px solid #E5E7EB;
}

.header{

    padding:36px;

    background:#E6F4E6;

    text-align:center;

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

    color:#4B5563;

    font-size:15px;
}

.receipt-number{

    margin-top:24px;

    color:#6B7280;

    font-size:13px;
}

.reference{

    margin-top:6px;

    font-size:20px;

    font-weight:700;

    color:#111827;
}

.date{

    margin-top:16px;

    color:#4B5563;

    font-size:14px;
}

.section{

    padding:30px 34px;
}

.status{

    display:inline-block;

    padding:8px 18px;

    border-radius:999px;

    font-size:13px;

    font-weight:700;

    color:${statusColors[transaction.status]};

    background:${statusBackgrounds[transaction.status]};
}

.amount{

    margin-top:24px;

    font-size:46px;

    font-weight:700;

    text-align:center;

    color:#111827;
}

.section-title{

    margin-bottom:22px;

    font-size:18px;

    font-weight:700;
}

.row{

    display:flex;

    justify-content:space-between;

    align-items:center;

    padding:14px 0;
}

.label{

    color:#6B7280;

    font-size:14px;
}

.value{

    font-size:15px;

    font-weight:600;

    color:#111827;

    text-align:right;
}

.summary{

    background:#F9FAFB;

    border:1px solid #E5E7EB;

    border-radius:14px;

    padding:22px;

    margin-top:18px;
}

.summary-row{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:14px;
}

.summary-label{

    color:#6B7280;

    font-size:14px;
}

.summary-value{

    font-size:15px;

    font-weight:600;
}

.total{

    border-top:1px solid #D1D5DB;

    margin-top:16px;

    padding-top:18px;

    font-size:18px;

    font-weight:700;
}

.divider{

    height:1px;

    background:#E5E7EB;
}

.footer{

    text-align:center;

    padding:36px;

    color:#6B7280;

    font-size:13px;
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

<div class="section" style="text-align:center">

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

Payment Summary

</div>

<div class="summary">

<div class="summary-row">

<div class="summary-label">

Transaction Amount

</div>

<div class="summary-value">

${amount}

</div>

</div>

<div class="summary-row">

<div class="summary-label">

Processing Fee

</div>

<div class="summary-value">

${processingFee}

</div>

</div>

<div class="summary-row">

<div class="summary-label">

VAT

</div>

<div class="summary-value">

${vat}

</div>

</div>

<div class="summary-row">

<div class="summary-label">

Currency

</div>

<div class="summary-value">

${transaction.currency ?? "NGN"}

</div>

</div>

<div class="summary-row">

<div class="summary-label">

Payment Status

</div>

<div
class="summary-value"
style="color:${statusColors[transaction.status]}"
>

${transaction.status.toUpperCase()}

</div>

</div>

<div class="summary-row total">

<div>

Total Paid

</div>

<div>

${total}

</div>

</div>

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
style="color:${statusColors[transaction.status]}"
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

Customer

</div>

<div class="value">

${transaction.customer}

</div>

</div>

</div>

<div class="divider"></div>

<div class="footer">

Generated by XpressStore Merchant Platform

</div>

</div>

</body>

</html>
`;
}