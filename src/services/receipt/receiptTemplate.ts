import { Transaction } from "@/types/transaction";

import { formatCurrency } from "@/utils/formatters/currency";
import { formatDateTime } from "@/utils/formatters/date";

import type { ReceiptVerification } from "./receiptVerification";

export function receiptTemplate(
  transaction: Transaction,
  verification: ReceiptVerification,
  qrCodeDataUri: string
) {
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

  const merchant = {
    name: "XpressStore Merchant",
    id: "MCH-000001",
    email: "support@xpresspayments.com",
    phone: "+234 700 XPRESS",
    website: "www.xpresspayments.com",
    address: "Lagos, Nigeria",
  };

  const qrMarkup = qrCodeDataUri
    ? `
<img
  src="${qrCodeDataUri}"
  width="140"
  height="140"
/>
`
    : `
<div
  style="
    width:140px;
    height:140px;
    margin:auto;
    background:#E5E7EB;
    border-radius:12px;
    display:flex;
    align-items:center;
    justify-content:center;
    color:#6B7280;
    font-size:14px;
    font-weight:600;
  "
>
  QR CODE
</div>
`;

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
padding:40px;
background:#F5F6F8;
font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
color:#111827;
}

.receipt{
max-width:760px;
margin:auto;
background:#FFFFFF;
border-radius:18px;
overflow:hidden;
border:1px solid #E5E7EB;
}

.header{
padding:36px;
background:#E6F4E6;
border-bottom:1px solid #CDE9CD;
display:flex;
justify-content:space-between;
align-items:flex-start;
}

.branding{
flex:1;
}

.logo{
font-size:30px;
font-weight:700;
color:#006F01;
}

.subtitle{
margin-top:6px;
font-size:15px;
color:#4B5563;
}

.merchant{
text-align:right;
font-size:13px;
line-height:1.8;
color:#4B5563;
}

.reference{
padding:28px;
text-align:center;
}

.reference-title{
font-size:13px;
color:#6B7280;
}

.reference-number{
margin-top:8px;
font-size:22px;
font-weight:700;
}

.date{
margin-top:8px;
font-size:14px;
color:#6B7280;
}

.status{
display:inline-block;
padding:8px 18px;
margin-top:18px;
border-radius:999px;
font-weight:700;
font-size:13px;
background:${statusBackgrounds[transaction.status]};
color:${statusColors[transaction.status]};
}

.amount{
margin-top:28px;
font-size:46px;
font-weight:700;
}

.section{
padding:30px 36px;
}

.section-title{
font-size:18px;
font-weight:700;
margin-bottom:20px;
}

.summary{
background:#F9FAFB;
border:1px solid #E5E7EB;
border-radius:14px;
padding:22px;
}

.row{
display:flex;
justify-content:space-between;
padding:14px 0;
}

.label{
font-size:14px;
color:#6B7280;
}

.value{
font-size:15px;
font-weight:600;
text-align:right;
}

.total{
margin-top:14px;
padding-top:18px;
border-top:1px solid #D1D5DB;
font-size:18px;
font-weight:700;
}

.divider{
height:1px;
background:#E5E7EB;
}

.verify{
padding:32px 36px;
background:#F9FAFB;
}

.verify-box{
border:1px dashed #D1D5DB;
border-radius:14px;
padding:24px;
text-align:center;
}

.qr{
margin-bottom:20px;
}

.verify-title{
font-size:18px;
font-weight:700;
}

.verify-text{
margin-top:8px;
font-size:14px;
color:#6B7280;
}

.verify-link{
margin-top:14px;
font-size:13px;
color:#006F01;
word-break:break-all;
}

.verify-code{
margin-top:14px;
font-size:13px;
font-weight:700;
letter-spacing:1px;
color:#111827;
}

.footer{
padding:28px;
background:#FAFAFA;
text-align:center;
font-size:13px;
color:#6B7280;
}

</style>

</head>

<body>

<div class="receipt">

<div class="header">

<div class="branding">

<div class="logo">

XPRESSSTORE

</div>

<div class="subtitle">

Digital Payment Receipt

</div>

</div>

<div class="merchant">

<div><strong>${merchant.name}</strong></div>

<div>${merchant.address}</div>

<div>${merchant.phone}</div>

<div>${merchant.email}</div>

<div>${merchant.website}</div>

<div>Merchant ID: ${merchant.id}</div>

</div>

</div>

<div class="reference">

<div class="reference-title">

Receipt Number

</div>

<div class="reference-number">

${transaction.reference}

</div>

<div class="date">

${date}

</div>

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

<div class="row">
<div class="label">Transaction Amount</div>
<div class="value">${amount}</div>
</div>

<div class="row">
<div class="label">Processing Fee</div>
<div class="value">${processingFee}</div>
</div>

<div class="row">
<div class="label">VAT</div>
<div class="value">${vat}</div>
</div>

<div class="row">
<div class="label">Currency</div>
<div class="value">${transaction.currency ?? "NGN"}</div>
</div>

<div class="row">
<div class="label">Payment Status</div>
<div
  class="value"
  style="color:${statusColors[transaction.status]}"
>
${transaction.status.toUpperCase()}
</div>
</div>

<div class="row total">
<div>Total Paid</div>
<div>${total}</div>
</div>

</div>

</div>

<div class="divider"></div>

<div class="section">

<div class="section-title">

Transaction Information

</div>

<div class="row">
<div class="label">Reference</div>
<div class="value">${transaction.reference}</div>
</div>

<div class="row">
<div class="label">Customer</div>
<div class="value">${transaction.customer}</div>
</div>

<div class="row">
<div class="label">Payment Channel</div>
<div class="value">
${paymentChannels[transaction.channel]}
</div>
</div>

<div class="row">
<div class="label">Transaction Type</div>
<div class="value">
${transaction.type === "credit" ? "Credit" : "Debit"}
</div>
</div>

<div class="row">
<div class="label">Date & Time</div>
<div class="value">${date}</div>
</div>

</div>

<div class="divider"></div>

<div class="verify">

<div class="verify-box">

<div class="qr">

${qrMarkup}

</div>

<div class="verify-title">

Verify this Receipt

</div>

<div class="verify-text">

Scan the QR code or visit the verification URL below.

</div>

<div class="verify-link">

${verification.verificationUrl}

</div>

<div class="verify-code">

Verification Code

<br /><br />

${verification.verificationCode}

</div>

</div>

</div>

<div class="footer">

Generated securely by XpressStore Merchant Platform

</div>

</div>

</body>

</html>
`;
}