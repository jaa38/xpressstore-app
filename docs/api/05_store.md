# Store Endpoints

> Base URL: `https://api.myxpresspay.com/api/`
> All endpoints require **Bearer token**.

---

## Get Stores

Returns all stores belonging to the authenticated merchant.

- **Method:** `GET`
- **URL:** `https://api.myxpresspay.com/api/Store/GetStores`

**Request Body:** None

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": [
    {
      "storeId": 1,
      "storeName": "My Fashion Store",
      "storeReference": "my-fashion-store",
      "storeLink": "https://storelink.myxpresspay.com/store/my-fashion-store",
      "currency": "NGN",
      "welcomeMessage": "Welcome to our store!",
      "description": "Quality fashion items",
      "isActive": true,
      "themeColor": "#4CAF50",
      "products": [],
      "discounts": [],
      "callBackUrl": "https://mysite.com/callback",
      "successMessage": "Thank you for your order!",
      "whatsAppNumber": "+2348012345678",
      "phoneNumber": "+2348012345678",
      "email": "store@example.com",
      "instagram": "mystore_ig",
      "facebook": "mystore_fb",
      "twitter": "mystore_tw"
    }
  ]
}
```

---

## Get Store by ID

Returns a single store's details.

- **Method:** `GET`
- **URL:** `https://api.myxpresspay.com/api/Store/GetStoreById/{storeId}`

**Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `storeId` | string | Yes | Store ID |

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": {
    "storeId": 1,
    "storeName": "My Fashion Store",
    "storeReference": "my-fashion-store",
    "currency": "NGN",
    "isActive": true
  }
}
```

---

## Create Store

Creates a new merchant store.

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Store/CreateStore`

**Request Body**

```json
{
  "storeName": "My Fashion Store",
  "storeReference": "my-fashion-store",
  "welcomeMessage": "Welcome to our store!",
  "description": "Quality fashion items at great prices",
  "currency": "NGN",
  "storeLink": "https://storelink.myxpresspay.com/store/my-fashion-store",
  "storeDiscounts": [],
  "storeShippingRegion": [],
  "storeProducts": []
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `storeName` | string | Yes | Display name |
| `storeReference` | string | Yes | URL slug (no spaces) |
| `currency` | string | Yes | `NGN`, `USD`, `GBP`, or `EUR` |
| `storeLink` | string | Yes | Full store URL |
| `welcomeMessage` | string | No | Welcome text for buyers |
| `description` | string | No | Store description |
| `storeDiscounts` | array | No | Discount IDs to attach |
| `storeShippingRegion` | array | No | Shipping region IDs to attach |
| `storeProducts` | array | No | Product IDs to attach |

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Store created successfully",
  "data": {
    "id": 1,
    "storeName": "My Fashion Store",
    "storeReference": "my-fashion-store",
    "storeLink": "https://storelink.myxpresspay.com/store/my-fashion-store",
    "currency": "NGN"
  }
}
```

---

## Update Store

Updates an existing store.

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Store/UpdateStore`

**Request Body**

```json
{
  "id": 1,
  "storeName": "Updated Store Name",
  "currency": "NGN",
  "storeReference": "updated-store",
  "storeLink": "https://storelink.myxpresspay.com/store/updated-store",
  "isActive": true,
  "themeColor": "#FF5733",
  "welcomeMessage": "Welcome!",
  "description": "Updated description",
  "callBackUrl": "https://mysite.com/callback",
  "successMessage": "Order placed!",
  "whatsAppNumber": "+2348012345678",
  "phoneNumber": "+2348012345678",
  "email": "store@example.com",
  "instagram": "mystore_ig",
  "facebook": "mystore_fb",
  "twitter": "mystore_tw",
  "storeProducts": [1, 2, 3],
  "storeDiscounts": [10],
  "storeShippingRegion": [5]
}
```

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Store updated successfully",
  "data": {}
}
```

---

## Delete Store

Deletes a store by ID.

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Store/DeleteStore/{storeId}`

**Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `storeId` | integer | Yes | Store ID to delete |

**Request Body:** None

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Store deleted successfully",
  "data": null
}
```

---

## Validate Store Reference

Checks if a store slug is already in use.

- **Method:** `GET`
- **URL:** `https://api.myxpresspay.com/api/Store/ValidateStoreReference/{reference}`

**Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reference` | string | Yes | Proposed store slug |

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Reference is available",
  "data": { "isAvailable": true }
}
```

---

## Validate Store Name

Checks if a store display name is available.

- **Method:** `GET`
- **URL:** `https://api.myxpresspay.com/api/Store/ValidateStoreName/{storeName}`

**Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `storeName` | string | Yes | Proposed store display name |

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Name is available",
  "data": { "isAvailable": true }
}
```

---

## Get All Shipping Regions

Returns all shipping regions configured for the merchant.

- **Method:** `GET`
- **URL:** `https://api.myxpresspay.com/api/Store/GetAllMerchantShippingRegions`

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": [
    {
      "id": 1,
      "region": "Lagos",
      "state": "Lagos",
      "shippingFee": 2000.00
    }
  ]
}
```

---

## Create Shipping Region

Adds a new shipping region.

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Store/CreateShippingRegion`

**Request Body**

```json
{
  "region": "Lagos",
  "state": "Lagos",
  "shippingFee": 2000.00
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `region` | string | Yes | Region / city name |
| `state` | string | Yes | State name |
| `shippingFee` | number | Yes | Shipping fee amount |

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Shipping region created",
  "data": null
}
```

---

## Update Shipping Region

Updates an existing shipping region.

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Store/UpdateShippingRegion`

**Request Body**

```json
{
  "id": 1,
  "region": "Lagos",
  "state": "Lagos",
  "shippingFee": 2500.00
}
```

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Shipping region updated",
  "data": null
}
```

---

## Delete Shipping Region

Deletes a shipping region by ID.

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Store/DeleteShippingRegion/{regionId}`

**Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `regionId` | integer | Yes | Shipping region ID |

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Shipping region deleted",
  "data": null
}
```

---

## Toggle Order Delivery

Marks a store order as delivered or undelivered.

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Store/ToggleDelivery?IsDelivery={isDelivery}&TransactionId={transactionId}`

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `IsDelivery` | boolean | Yes | `true` = delivered, `false` = undelivered |
| `TransactionId` | string | Yes | Transaction ID of the order |

**Request Body:** None

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Delivery status updated",
  "data": null
}
```
