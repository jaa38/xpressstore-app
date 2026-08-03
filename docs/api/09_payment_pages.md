# Payment Pages & Subscription Endpoints

> Base URL: `https://api.myxpresspay.com/api/`
> All endpoints require **Bearer token**.

---

## Payment Pages

### Get All Payment Pages

Returns all payment pages created by the merchant.

- **Method:** `GET`
- **URL:** `https://api.myxpresspay.com/api/PaymentPages/GetAllPages`

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": [
    {
      "id": 1,
      "name": "Product Payment",
      "description": "Pay for product",
      "amount": 5000.00,
      "currency": "NGN",
      "pageType": "single",
      "paymentLinkReference": "pay-ref-001",
      "isActive": true,
      "isFixedAmount": true,
      "redirectUrl": "https://mysite.com/success"
    }
  ]
}
```

---

### Add Payment Page

Creates a new payment page (payment link).

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/PaymentPages/Add`

**Request Body**

```json
{
  "name": "Product Payment",
  "description": "Pay for product",
  "amount": 5000.00,
  "currency": "NGN",
  "pageType": "single",
  "isFixedAmount": true,
  "paymentLinkReference": "pay-ref-001",
  "redirectUrl": "https://mysite.com/success",
  "isPhoneNumberRequired": false,
  "isTestMode": false,
  "subAccountId": "sa-001",
  "subAccountGroupId": "sag-001",
  "extraFields": "[]"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Page display name |
| `description` | string | Yes | Description |
| `currency` | string | Yes | Currency code |
| `pageType` | string | Yes | `"single"` or `"donation"` |
| `paymentLinkReference` | string | Yes | URL slug (no spaces) |
| `amount` | number | No | Fixed amount (if `isFixedAmount` is true) |
| `isFixedAmount` | boolean | No | Lock amount |
| `redirectUrl` | string | No | Post-payment redirect URL |
| `isPhoneNumberRequired` | boolean | No | Require buyer's phone |
| `isTestMode` | boolean | No | Test mode flag |
| `subAccountId` | string | No | Sub-account to receive funds |
| `subAccountGroupId` | string | No | Sub-account group |
| `extraFields` | string | No | JSON-encoded extra form fields |

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Payment page created", "data": null }
```

---

### Update Payment Page

Same body as Add Payment Page with `id` field included.

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/PaymentPages/Update`

```json
{ "id": 1, "name": "Updated Payment Page", "description": "Updated description", "amount": 7500.00 }
```

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Payment page updated", "data": null }
```

---

### Validate Payment Page Reference

Checks if a payment page reference slug is already in use.

- **Method:** `GET`
- **URL:** `https://api.myxpresspay.com/api/PaymentPages/ValidatePaymentPageLinkRefernce/{reference}`

**Path Parameters:** `reference` (string, required)

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Reference is available", "data": { "isAvailable": true } }
```

---

### Get Payment Page Transactions

Returns all transactions made through a specific payment page.

- **Method:** `GET`
- **URL:** `https://api.myxpresspay.com/api/PaymentPages/GetPaymentPageTransactions/{paymentPageId}`

**Path Parameters:** `paymentPageId` (string, required)

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": [
    { "transactionId": "TXN001", "amount": 5000.00, "status": "Successful", "dateCreated": "2026-07-30T10:00:00" }
  ]
}
```

---

### Get Page by Reference

Retrieves a payment page by merchant ID and reference slug.

- **Method:** `GET`
- **URL:** `https://api.myxpresspay.com/api/PaymentPages/GetAllPages/{merchantId}/{reference}`

**Path Parameters:** `merchantId` (string), `reference` (string)

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Success", "data": { "id": 1, "name": "Product Payment" } }
```

---

## Subscriptions

### Get All Subscriptions

- **Method:** `GET`
- **URL:** `https://api.myxpresspay.com/api/Subcription/GetSubscriptions`

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": [
    {
      "id": 1,
      "name": "Monthly Newsletter",
      "description": "Monthly content subscription",
      "amount": 2000.00,
      "billingFrequency": "Monthly",
      "subscriptionReference": "newsletter-monthly",
      "subscriptionPageUrl": "https://storelink.myxpresspay.com/subscription/M12345/newsletter-monthly",
      "isActive": true
    }
  ]
}
```

---

### Create Subscription

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Subcription/CreateSubscription`

**Request Body**

```json
{
  "name": "Monthly Newsletter",
  "description": "Monthly content subscription",
  "billingFrequency": "Monthly",
  "noOfTimeToChargeSubscriber": "12",
  "subscriptionReference": "newsletter-monthly",
  "subscriptionPageUrl": "https://storelink.myxpresspay.com/subscription/M12345/newsletter-monthly",
  "isFixedAmount": false,
  "amount": 2000.00,
  "isPhoneNumberRequired": false,
  "redirectUrl": "https://mysite.com/thanks",
  "pageType": "single",
  "isTestMode": false,
  "extraFields": "[]",
  "subAccountId": "sa-001",
  "subAccountGroupId": "sag-001"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Subscription page name |
| `description` | string | Yes | Description |
| `billingFrequency` | string | Yes | `"Monthly"`, `"Weekly"`, `"Yearly"` |
| `subscriptionReference` | string | Yes | URL slug (no spaces) |
| `subscriptionPageUrl` | string | Yes | Full subscription URL |
| `pageType` | string | Yes | `"single"` |
| `noOfTimeToChargeSubscriber` | string | No | Max charge count |
| `isFixedAmount` | boolean | No | Lock amount |
| `amount` | number | No | Subscription amount |
| `redirectUrl` | string | No | Post-subscription redirect URL |
| `isTestMode` | boolean | No | Test mode |
| `extraFields` | string | No | JSON-encoded extra fields |
| `subAccountId` | string | No | Sub-account for collection |
| `subAccountGroupId` | string | No | Sub-account group |

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Subscription created successfully", "data": null }
```

---

### Update Subscription

Same body as Create Subscription with `id` included.

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Subcription/UpdateSubscription`

```json
{ "id": 1, "name": "Updated Newsletter", "amount": 2500.00, "billingFrequency": "Monthly" }
```

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Subscription updated", "data": null }
```

---

### Toggle Subscription

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Subcription/ToogleSubscription/{id}?IsActive={isActive}`

**Path Parameters:** `id` (string)

**Query Parameters:** `IsActive` (boolean — `true` = active, `false` = inactive)

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Subscription toggled", "data": null }
```

---

### Validate Subscription Reference

- **Method:** `GET`
- **URL:** `https://api.myxpresspay.com/api/Subcription/ValidateSubscriptionLinkRefernce/{reference}`

**Path Parameters:** `reference` (string, required)

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Reference is available", "data": { "isAvailable": true } }
```
