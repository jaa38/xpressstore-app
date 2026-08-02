import { Transaction } from "@/types/transaction";

import { formatCurrency } from "@/utils/formatters/currency";
import { formatDateTime } from "@/utils/formatters/date";

export function receiptTemplate(
  transaction: Transaction
) {
  const statusColor = {
    paid: "#16A34A",
    pending: "#D97706",
    failed: "#DC2626",
  }[transaction.status];

  const statusLabel = {
    paid: "Paid",
    pending: "Pending",
    failed: "Failed",
  }[transaction.status];

  const paymentChannel = {
    bank: "Bank",
    card: "Card",
    qr: "QR Code",
    transfer: "Transfer",
    ussd: "USSD",
  }[transaction.channel];

  const transactionType =
    transaction.type === "credit"
      ? "Credit"
      : "Debit";

  return `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8"/>

<style>

*{
box-sizing:border-box;
margin:0;
padding:0;
font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
}

body{
padding:32px;
background:#F9FAFB;
color:#111827;
}

.receipt{
max-width:480px;
margin:0 auto;
background:white;
border:1px solid #E5E7EB;
border-radius:16px;
padding:32px;
}

.logo{
font-size:24px;
font-weight:700;
color:#006F01;
text-align:center;
margin-bottom:8px;
}

.subtitle{
text-align:center;
color:#6B7280;
margin-bottom:32px;
font-size:14px;
}

.amount{
font-size:36px;
font-weight:700;
text-align:center;
margin-bottom:8px;
}

.status{
text-align:center;
font-weight:600;
margin-bottom:32px;
color:${statusColor};
}

.section{
margin-top:24px;
}

.row{
display:flex;
justify-content:space-between;
padding:12px 0;
border-bottom:1px solid #F3F4F6;
}

.label{
color:#6B7280;
}

.value{
font-weight:600;
}

.footer{
margin-top:40px;
text-align:center;
font-size:13px;
color:#6B7280;
}

</style>

</head>

<body>

<div class="receipt">

<div class="logo">
XPRESSSTORE
</div>

<div class="subtitle">
Payment Receipt
</div>

<div class="amount">
${formatCurrency(transaction.amount, {
  currency: transaction.currency,
})}
</div>

<div class="status">
${statusLabel}
</div>

<div class="section">

<div class="row">
<span class="label">Reference</span>
<span class="value">${transaction.reference}</span>
</div>

<div class="row">
<span class="label">Customer</span>
<span class="value">${transaction.customer}</span>
</div>

<div class="row">
<span class="label">Payment Channel</span>
<span class="value">${paymentChannel}</span>
</div>

<div class="row">
<span class="label">Transaction Type</span>
<span class="value">${transactionType}</span>
</div>

<div class="row">
<span class="label">Date</span>
<span class="value">
${formatDateTime(
  new Date(transaction.createdAt)
)}
</span>
</div>

</div>

<div class="footer">

Thank you for using XpressStore.

<br/><br/>

Powered by Xpress Payments

</div>

</div>

</body>

</html>
`;
}