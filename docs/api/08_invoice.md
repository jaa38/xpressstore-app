# Invoice Endpoints

> Base URL: `https://api.myxpresspay.com/api/`
> All endpoints require **Bearer token**.

---

## Get Merchant Invoices

Returns all invoices created by the authenticated merchant.

- **Method:** `GET`
- **URL:** `https://api.myxpresspay.com/api/Invoices/GetMerchantInvoice`

**Request Body:** None

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": [
    {
      "id": 1,
      "invoiceNumber": "INV-0001",
      "invoiceName": "July Services",
      "customerId": 10,
      "totalAmount": 50000.00,
      "grossAmount": 50000.00,
      "currency": "NGN",
      "status": "Pending",
      "isSuccessful": false,
      "dueDates": "2026-08-15T00:00:00",
      "companyName": "Acme Ltd",
      "companyEmail": "acme@example.com",
      "companyAddress": "12 Lagos Street",
      "discountAmount": 0,
      "discountPercentage": 0,
      "taxAmount": 0,
      "taxPercentage": 0,
      "invoiceNote": "Payment due in 30 days",
      "dateCreated": "2026-07-01T10:00:00",
      "isActive": true,
      "productItems": [
        { "description": "Web Design", "quantity": 1, "amount": 50000.00 }
      ]
    }
  ]
}
```

---

## Create Invoice

Creates a new invoice for a customer.

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Invoices/CreateInvoice`

**Request Body**

```json
{
  "customerId": 10,
  "companyLogo": "https://cdn.example.com/logo.png",
  "address": "12 Customer Street",
  "state": "Lagos",
  "billingCity": "Lagos",
  "zipCode": "100001",
  "country": "Nigeria",
  "companyName": "Acme Ltd",
  "companyEmail": "acme@example.com",
  "companyAddress": "5 Business Avenue",
  "companyCity": "Abuja",
  "companyState": "FCT",
  "companyCountry": "Nigeria",
  "invoiceName": "July Services",
  "currency": "NGN",
  "dueDate": "2026-08-15T00:00:00.000Z",
  "reminders": [
    { "type": "Email", "noOfDays": 3 }
  ],
  "productItems": [
    { "description": "Web Design", "quantity": "1", "amount": "50000" }
  ],
  "discountAmount": 0,
  "discountPercentage": 0,
  "taxAmount": 0,
  "taxPercentage": 0,
  "invoiceNote": "Payment due in 30 days"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `customerId` | integer | Yes | Customer ID |
| `invoiceName` | string | Yes | Invoice title |
| `currency` | string | Yes | Currency code |
| `dueDate` | string | Yes | Due date (ISO 8601) |
| `productItems` | array | Yes | Line items: `[{description, quantity, amount}]` |
| `companyName` | string | Yes | Sender company name |
| `companyEmail` | string | Yes | Sender company email |
| `reminders` | array | No | `[{type, noOfDays}]` |
| `discountAmount` | number | No | Flat discount |
| `taxAmount` | number | No | Tax amount |
| `invoiceNote` | string | No | Notes on invoice |

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Invoice created successfully", "data": null }
```

---

## Update Invoice

Updates an existing invoice. Same body as Create Invoice with `id` field included.

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Invoices/UpdateInvoice`

```json
{
  "id": 1,
  "invoiceName": "Updated Invoice",
  "currency": "NGN",
  "dueDate": "2026-09-01T00:00:00.000Z",
  "productItems": [
    { "description": "Revised Service", "quantity": "2", "amount": "25000" }
  ]
}
```

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Invoice updated", "data": null }
```

---

## Change Invoice Status

Toggles an invoice between paid / unpaid.

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Invoices/ChangeInvoiceStatus/{invoiceId}`

**Path Parameters:** `invoiceId` (string, required)

**Request Body:** None

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Invoice status changed", "data": null }
```

---

## Send Invoice to Customer

Sends an invoice to the customer via email.

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Invoices/SendInvoiceToCustomer/{invoiceId}`

**Path Parameters:** `invoiceId` (string, required)

**Request Body:** None

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Invoice sent to customer", "data": null }
```
