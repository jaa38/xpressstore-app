# XpressStore API — Overview & Authentication

> Flutter app: `xpresspaystorefront` | Date: 2026-07-31

---

## Overview

XpressStore is a Flutter-based merchant storefront application by **XpressPayments**. It allows merchants to manage stores, products, invoices, payment pages, subscriptions, and settlements. The app communicates with two REST API backends and one GraphQL endpoint.

All REST requests use JSON (`Content-Type: application/json`). File upload endpoints use `multipart/form-data`.

---

## Base URLs

| Environment | Auth Base URL | API Gateway Base URL |
|-------------|--------------|----------------------|
| **Production** | `https://sso.xpresspayments.com:2503/api/v2/` | `https://api.myxpresspay.com/api/` |
| **Sandbox** | `https://pgsandbox.xpresspayments.com:2503/api/v2/` | `https://pgsandbox.xpresspayments.com:8090/api/` |

| Service | URL |
|---------|-----|
| **Store Link** (prod) | `https://storelink.myxpresspay.com` |
| **Store Link** (sandbox) | `https://pgsandbox.xpresspayments.com:9200` |
| **GraphQL** | `https://myxpresspay.com:7015/` |
| **Cloudinary (KYC docs)** | `https://api.cloudinary.com/v1_1/dgdwce3rq/image/upload` |

> **Which base URL per endpoint?**
> - `StoreFront/`, `Account/`, `kycTiers/`, `KycTiers/`, `MerchantKyc/`, `Industry/`, `Validator/`, `merchants/` → **Auth Base URL**
> - `Store/`, `Product/`, `Invoices/`, `PaymentPages/`, `Subcription/`, `Merchants/` → **API Gateway Base URL**

---

## Authentication

The app uses **Bearer Token (JWT)** authentication.

### Request Headers

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json
```

### Token Acquisition

Tokens are returned from the [Login](./01_auth.md#login) endpoint under `data.token.jwtToken` and stored securely on the device. Every authenticated request attaches this token as the `Authorization` header.

### Token Expiry

The login response includes `data.token.tokenExpireOn`. On any `HTTP 401` response the app automatically clears stored tokens and logs the user out.

---

## Common Response Structure

All REST endpoints return a consistent JSON envelope:

```json
{
  "responseCode": "00",
  "responseMessage": "Human-readable message",
  "data": {}
}
```

| Field | Type | Description |
|-------|------|-------------|
| `responseCode` | string | `"00"` = success; any other value = failure |
| `responseMessage` | string | Result description |
| `data` | object \| array \| null | Payload; shape varies per endpoint |

> Some auth endpoints return `"0"` instead of `"00"` for success — both indicate success.

---

## Error Handling

| HTTP Status | App Behaviour |
|-------------|---------------|
| `200` | Parse response body normally |
| `401` | Auto-logout; clear stored tokens |
| `403` | Throw "permission denied" exception |
| `4xx / 5xx` | Parse error body if present, else throw generic exception |
| Connection timeout | Throw `"Check your internet connection"` message |
| Connection error | Throw `"Check your internet connection"` message |

---

## Module Index

| File | Contents |
|------|----------|
| [01_auth.md](./01_auth.md) | Register, Login, OTP, Password management, Business details |
| [02_kyc.md](./02_kyc.md) | KYC tiers, document upload, BVN & business verification |
| [03_lookup.md](./03_lookup.md) | Industries, business types, banks, sub-accounts |
| [04_dashboard.md](./04_dashboard.md) | Dashboard summary metrics |
| [05_store.md](./05_store.md) | Store CRUD, shipping regions, delivery toggle |
| [06_product.md](./06_product.md) | Product CRUD, images, categories, discounts, customers |
| [08_invoice.md](./08_invoice.md) | Invoice CRUD, status, send |
| [09_payment_pages.md](./09_payment_pages.md) | Payment pages & subscriptions |
| [10_profile.md](./10_profile.md) | Settlement accounts, payment methods, notifications |
| [11_graphql.md](./11_graphql.md) | GraphQL transaction queries |
