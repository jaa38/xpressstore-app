# GraphQL API

- **Endpoint:** `https://myxpresspay.com:7015/`
- **Method:** `POST`
- **Auth:** `Authorization: Bearer <jwtToken>`
- **Content-Type:** `application/json`

All queries are sent as standard GraphQL POST requests. Variables are passed in the `variables` key.

---

## TransactionFilterInput

Shared filter type used by all transaction queries.

```json
{
  "customerEmail": null,
  "reference": null,
  "transactionId": null,
  "startDate": null,
  "endDate": null,
  "cardBrand": null,
  "paymentMethod": null,
  "status": null
}
```

| Field | Type | Description |
|-------|------|-------------|
| `customerEmail` | string \| null | Filter by buyer email |
| `reference` | string \| null | Filter by payment reference |
| `transactionId` | string \| null | Filter by transaction ID |
| `startDate` | string \| null | Start of date range (ISO 8601) |
| `endDate` | string \| null | End of date range (ISO 8601) |
| `cardBrand` | string \| null | Filter by card brand (e.g. `"Visa"`) |
| `paymentMethod` | string \| null | Filter by payment method |
| `status` | string \| null | Filter by status (e.g. `"Successful"`) |

---

## Store Transactions Query

Fetches paginated store order transactions.

```graphql
query StoreTransactions($page: Int!, $limit: Int!, $filter: TransactionFilterInput!) {
  storeTransactions(page: $page, limit: $limit, filter: $filter) {
    items {
      id
      firstName
      lastName
      email
      phoneNumber
      customerAddress
      city
      currency
      country
      deliveryNotes
      isBeneficiary
      totalAmount
      dateCreated
      storeName
      dateUpdated
      isDelivered
      isSuccessful
      transactionId
      status
      paymentResponseMessage
      productDescription
      paymentDate
      paymentReference
      metaData
      merchantId
      discount {
        code
        discountAmount
      }
      deliveryDetails {
        customerAddress
        deliveryFee
        region
      }
      productPurchased {
        id
        productName
        quantity
        amount
        isLiked
        rating
        comment
      }
    }
    totalCount
    pageNumber
    pageSize
  }
}
```

**Variables**

```json
{
  "page": 1,
  "limit": 20,
  "filter": {
    "customerEmail": null,
    "reference": null,
    "transactionId": null,
    "startDate": null,
    "endDate": null,
    "status": null
  }
}
```

**Response Fields**

| Field | Description |
|-------|-------------|
| `items` | Array of store transactions |
| `items[].totalAmount` | Order total |
| `items[].isDelivered` | Whether marked as delivered |
| `items[].productPurchased` | Products in the order |
| `items[].deliveryDetails` | Delivery address and fee |
| `items[].discount` | Applied discount code and amount |
| `totalCount` | Total matching records |
| `pageNumber` | Current page |
| `pageSize` | Items per page |

---

## General Transactions Query

Fetches paginated payment transactions (non-store / payment links).

```graphql
query GetTransactions($page: Int!, $limit: Int!, $filter: TransactionFilterInput!) {
  transactions(page: $page, limit: $limit, filter: $filter) {
    items {
      id
      transactionReference
      firstname
      lastname
      amount
      paymentType
      email
      pageName
      pageType
      currency
      transactionId
      xpressReference
      providerReference
      phoneNumber
      narration
      cardBin
      brand
      cardType
      processor
      merchantId
      paymentResponseCode
      paymentResponseMessage
      dateCreated
      dateModified
      transType
      cardPan
      metaData
      productDescription
      merchantName
      transactionNumber
      transactionDate
    }
    totalCount
    pageNumber
    pageSize
  }
}
```

**Variables** — same `TransactionFilterInput` as above.

---

## Store Transaction Summary

Returns aggregate statistics for all store orders.

```graphql
query {
  storeTransactionSummarry(
    filter: {
      customerEmail: null
      reference: null
      transactionId: null
      startDate: null
      endDate: null
      cardBrand: null
      paymentMethod: null
      status: null
    }
  ) {
    item {
      totalOrders
      totalNonDiscountedOrders
      totalDiscountedOrders
      totalGrossSales
      totalNetSales
      totalNonDiscountedAmount
      totalDiscountedAmount
      totalCompletedProductAmount
      totalAbandonedProductAmount
      totalCompletedProduct
      totalAbandonedProduct
      totalSuccessful
      totalSuccessfulAmount
      totalFailed
      totalFailedAmount
      topProducts {
        totalQuantity
        productName
      }
      topCustomers {
        totalQuantityOrder
        name
        email
      }
    }
  }
}
```

**Response Fields**

| Field | Description |
|-------|-------------|
| `totalOrders` | Total number of orders |
| `totalGrossSales` | Total gross revenue |
| `totalNetSales` | Net revenue after discounts |
| `totalSuccessful` | Count of successful orders |
| `totalFailed` | Count of failed orders |
| `topProducts` | Best-selling products with quantities |
| `topCustomers` | Top customers by order count |

---

## Transaction Summary

Returns aggregate statistics for general payment transactions.

```graphql
query {
  transactionSummarry(
    filter: {
      customerEmail: null
      reference: null
      transactionId: null
      startDate: null
      endDate: null
      cardBrand: null
      paymentMethod: null
      status: null
    }
  ) {
    item {
      transactionVolume
      totalTransactionAmount
      nextSettlementAmount
      totalCardTransactionAmount
      totalUSSDTransactionAmount
      totalTransferTransactionAmount
      totalAccountTransactionAmount
      totalQRAmount
      totalENairaTransactionAmount
      totalWalletAmount
    }
  }
}
```

**Response Fields**

| Field | Description |
|-------|-------------|
| `transactionVolume` | Total number of transactions |
| `totalTransactionAmount` | Total transaction value |
| `nextSettlementAmount` | Amount pending next settlement |
| `totalCardTransactionAmount` | Card payment total |
| `totalUSSDTransactionAmount` | USSD payment total |
| `totalTransferTransactionAmount` | Bank transfer total |
| `totalQRAmount` | QR code payment total |
| `totalENairaTransactionAmount` | eNaira payment total |
| `totalWalletAmount` | Wallet payment total |
