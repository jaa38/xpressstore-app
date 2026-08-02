import { Transaction } from "@/types/transaction";

import { formatCurrency } from "@/utils/formatters/currency";
import { formatDateTime } from "@/utils/formatters/date";

export function receiptTemplate(transaction: Transaction) {
  const amount = formatCurrency(transaction.amount, {
    currency: transaction.currency,
  });

  const date = formatDateTime(new Date(transaction.createdAt));

  return `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8" />

<style>

body{
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
    background:#f9fafb;
    color:#111827;
    padding:32px;
}

.receipt{

    max-width:680px;

    margin:auto;

    background:#ffffff;

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

<div class="section">

<div class="amount">

${amount}

</div>

</div>

<div class="divider"></div>

</div>

</body>

</html>
`;
}
