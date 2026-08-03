# Profile, Settlement, Payment Methods & Notifications

> Base URL: `https://api.myxpresspay.com/api/`
> All endpoints require **Bearer token**.

---

## Settlement Accounts

### Get Settlement Account

Returns the merchant's configured settlement bank account(s).

- **Method:** `GET`
- **URL:** `https://api.myxpresspay.com/api/Merchants/GetSettlementAccount`

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": [
    {
      "id": 1,
      "accountNumber": "0123456789",
      "accountName": "John Doe",
      "bankName": "Access Bank",
      "bankCode": "044",
      "isPrimary": true
    }
  ]
}
```

---

### Validate Settlement Account

Looks up an account name using the account number and bank code (name enquiry).

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Merchants/ValidateSettlementAccount`

**Request Body**

```json
{
  "bankCode": "044",
  "accountNumber": "0123456789"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `bankCode` | string | Yes | Bank code (e.g. `"044"` for Access Bank) |
| `accountNumber` | string | Yes | 10-digit account number |

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Account validated",
  "data": {
    "accountNumber": "0123456789",
    "accountName": "John Doe",
    "bankCode": "044",
    "bankName": "Access Bank"
  }
}
```

---

### Update Settlement Account

Adds or updates the merchant's settlement bank account.

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Merchants/UpdateSettlementAccount`

**Request Body**

```json
{
  "accountNumber": "0123456789",
  "accountName": "John Doe",
  "bankName": "Access Bank",
  "bankCode": "044",
  "isPrimary": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `accountNumber` | string | Yes | Bank account number |
| `accountName` | string | Yes | Account holder name |
| `bankName` | string | Yes | Bank name |
| `bankCode` | string | Yes | Bank code |
| `isPrimary` | boolean | No | Set as primary settlement account |

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Settlement account updated", "data": null }
```

---

### Delete Settlement Account

Removes a settlement account by ID.

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Merchants/DeleteSettlementAccount/{settlementId}`

**Path Parameters:** `settlementId` (string, required)

**Request Body:** None

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Settlement account deleted", "data": null }
```

---

## Payment Methods

### Get Payment Methods

Returns all payment methods and their enabled/disabled status.

- **Method:** `GET`
- **URL:** `https://api.myxpresspay.com/api/Merchants/payment-methods`

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": [
    { "id": 1, "methodName": "Card", "isEnabled": true },
    { "id": 2, "methodName": "Bank Transfer", "isEnabled": true },
    { "id": 3, "methodName": "USSD", "isEnabled": false }
  ]
}
```

---

### Update Payment Method

Enables or disables a payment method.

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Merchants/UpdatePaymentMethod`

**Request Body**

```json
{
  "methodId": 3,
  "isEnabled": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `methodId` | integer | Yes | Payment method ID |
| `isEnabled` | boolean | Yes | `true` to enable, `false` to disable |

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Payment method updated", "data": null }
```

---

## Push Notifications

### Register Push Notification Token

Registers a device FCM token for push notifications.

- **Method:** `GET`
- **URL:** `https://api.myxpresspay.com/api/Merchants/RegisterPushNotification?email={email}&fcM_Token={fcmToken}&caller=1`

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | Merchant email address |
| `fcM_Token` | string | Yes | Firebase Cloud Messaging device token |
| `caller` | integer | Yes | Always `1` for mobile |

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Token registered", "data": null }
```
