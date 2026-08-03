# Product, Category, Discount & Customer Endpoints

> Base URL: `https://api.myxpresspay.com/api/`
> All endpoints require **Bearer token**.

---

## Products

### Get Merchant Products

Returns all products belonging to the merchant.

- **Method:** `GET`
- **URL:** `https://api.myxpresspay.com/api/Product/GetMerchantProducts?pageSize=100`

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageSize` | integer | No | Number of results (default: 100) |

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": [
    {
      "id": 1,
      "productReference": "PROD-001",
      "productName": "Blue Dress",
      "description": "Elegant blue evening dress",
      "unitPrice": 15000.00,
      "currency": "NGN",
      "inStock": true,
      "totalInStock": 20,
      "isActive": true,
      "youtubeLink": "https://youtube.com/watch?v=abc",
      "productImages": [],
      "productCategories": [],
      "variations": []
    }
  ]
}
```

---

### Get Products by Store

Returns products assigned to a specific store.

- **Method:** `GET`
- **URL:** `https://api.myxpresspay.com/api/Product/stores/{storeId}`

**Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `storeId` | integer | Yes | Store ID |

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Success", "data": [] }
```

---

### Create Product

Creates a new product.

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Product/CreateProduct`

**Request Body**

```json
{
  "id": 0,
  "name": "Blue Dress",
  "description": "Elegant blue evening dress",
  "youtubeLink": "https://youtube.com/watch?v=abc",
  "currency": "NGN",
  "price": 15000.00,
  "unit": "20",
  "productLocation": "Lagos",
  "minOrderQty": "1",
  "hasVariants": false,
  "images": [
    { "filename": "blue-dress.jpg", "url": "https://cdn.example.com/blue-dress.jpg" }
  ],
  "categoryIds": [1, 2],
  "variations": [],
  "options": [],
  "publishNow": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Product name |
| `description` | string | Yes | Product description |
| `price` | number | Yes | Unit price |
| `currency` | string | Yes | Currency code |
| `unit` | string | No | Stock quantity |
| `productLocation` | string | No | Pickup / delivery location |
| `minOrderQty` | string | No | Minimum order quantity |
| `hasVariants` | boolean | No | Whether product has variations |
| `images` | array | No | `[{filename, url}]` objects |
| `categoryIds` | array | No | Category IDs to assign |
| `variations` | array | No | Variation objects |
| `options` | array | No | Option objects |
| `publishNow` | boolean | No | Publish immediately |
| `youtubeLink` | string | No | YouTube demo URL |

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Product created successfully",
  "data": {
    "id": 101,
    "productReference": "PROD-101",
    "productName": "Blue Dress",
    "productUrl": "https://storelink.myxpresspay.com/product/PROD-101",
    "currency": "NGN",
    "unitPrice": 15000.00,
    "inStock": true,
    "isActive": true
  }
}
```

---

### Update Product

Updates an existing product. Same body as Create Product with `id` set.

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Product/UpdateProduct`

```json
{
  "id": 101,
  "name": "Updated Blue Dress",
  "price": 16000.00,
  "currency": "NGN",
  "publishNow": true
}
```

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Product updated successfully", "data": {} }
```

---

### Delete Product

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Product/DeleteProduct/{productId}`

**Path Parameters:** `productId` (string, required)

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Product deleted successfully", "data": null }
```

---

### Toggle Product Status

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Product/ToggleProduct/{productId}/{status}`

**Path Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `productId` | string | Product ID |
| `status` | boolean | `true` = active, `false` = inactive |

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Product status updated", "data": null }
```

---

### Add Product to Stores

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Product/AddProductToStores`

```json
{ "productId": 101, "storeIds": [1, 2] }
```

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Products assigned to stores", "data": null }
```

---

### Upload Product Images

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Product/UploadProductImages`
- **Content-Type:** `multipart/form-data`

**Form Fields:** `file` (File, required — multiple allowed)

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Uploaded successfully",
  "data": [
    { "filename": "blue-dress.jpg", "url": "https://cdn.example.com/blue-dress.jpg" }
  ]
}
```

---

## Product Categories

### Get All Product Categories

- **Method:** `GET`
- **URL:** `https://api.myxpresspay.com/api/Product/GetAllProductCategory`

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": [
    { "id": 1, "name": "Dresses", "description": "All dress types", "isActive": true }
  ]
}
```

---

### Create Product Category

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Product/CreateProductCategory`

```json
{ "name": "Dresses", "description": "All types of dresses" }
```

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Category created", "data": { "id": 1, "name": "Dresses" } }
```

---

### Update Product Category

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Product/UpdateProductCategory`

```json
{ "id": 1, "name": "Updated Dresses", "description": "Updated description" }
```

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Category updated", "data": null }
```

---

### Delete Product Category

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Product/DeleteProductCategory/{categoryId}`

**Path Parameters:** `categoryId` (string, required)

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Category deleted", "data": null }
```

---

## Discounts

### Get All Merchant Discounts

- **Method:** `GET`
- **URL:** `https://api.myxpresspay.com/api/Product/GetAllMerchantDiscounts`

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": [
    { "id": "disc-001", "code": "SAVE10", "discountValue": 10, "startDate": "2026-07-01", "endDate": "2026-12-31", "isActive": true }
  ]
}
```

---

### Create Discount Code

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Product/CreateDiscount`

```json
{
  "code": "SAVE10",
  "discountValue": 10,
  "numberOfTimes": 100,
  "startDate": "2026-07-01",
  "endDate": "2026-12-31",
  "limitCodeToOneCustomer": false
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `code` | string | Yes | Discount code string |
| `discountValue` | number | Yes | Amount or percentage |
| `numberOfTimes` | integer | No | Max uses |
| `startDate` | string | No | Validity start |
| `endDate` | string | No | Validity end |
| `limitCodeToOneCustomer` | boolean | No | One use per customer |

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Discount code created", "data": null }
```

---

### Update Discount Code

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Product/UpdateDiscount`

```json
{ "id": "disc-001", "code": "SAVE15", "discountValue": 15 }
```

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Discount code updated", "data": null }
```

---

### Update Discount Status

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Product/UpdateDiscountStatus?Id={id}&status={status}`

**Query Parameters:** `Id` (string), `status` (boolean)

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Status updated", "data": null }
```

---

### Delete Discount Code

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Product/DeleteDiscount?Id={discountId}`

**Query Parameters:** `Id` (string, required)

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Discount code deleted", "data": null }
```

---

## Customers

### Get All Customers

- **Method:** `GET`
- **URL:** `https://api.myxpresspay.com/api/Invoices/GetCustomer`

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": [
    { "id": 1, "firstName": "Jane", "lastName": "Smith", "email": "jane@example.com", "phoneNumber": "+2348099887766", "isBlackListed": false }
  ]
}
```

---

### Create Customer

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Invoices/CreateCustomer`

```json
{ "firstName": "Jane", "lastName": "Smith", "email": "jane@example.com", "phoneNumber": "+2348099887766" }
```

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Customer created", "data": { "id": 1 } }
```

---

### Update Customer

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Invoices/UpdateCustomer`

```json
{ "id": 1, "firstName": "Jane", "lastName": "Smith", "email": "jane@example.com", "phoneNumber": "+2348099887766" }
```

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Customer updated", "data": null }
```

---

### Blacklist Customer

- **Method:** `POST`
- **URL:** `https://api.myxpresspay.com/api/Invoices/BlackListCustomer/{customerId}?IsBlackListed={isBlackListed}`

**Path Parameters:** `customerId` (integer)

**Query Parameters:** `IsBlackListed` (boolean — `true` = blacklist, `false` = remove)

**Success Response — `200 OK`**

```json
{ "responseCode": "00", "responseMessage": "Customer blacklist status updated", "data": null }
```
