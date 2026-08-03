# Reference / Lookup Endpoints

> Base URL: `https://sso.xpresspayments.com:2503/api/v2/`
> All endpoints require **Bearer token** unless noted.

These are read-only lookup endpoints used to populate dropdowns during onboarding and setup screens.

---

## Get Industries

Returns all business industries.

- **Method:** `GET`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/Industry/GetIndustries`
- **Auth required:** Yes

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": [
    { "industryId": 1, "industryName": "Healthcare", "isActive": true },
    { "industryId": 2, "industryName": "Retail", "isActive": true }
  ]
}
```

---

## Get Industry Categories

Returns categories for a specific industry.

- **Method:** `GET`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/Industry/GetIndustryCategories?IndustryId={industryId}`
- **Auth required:** Yes

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `IndustryId` | integer | Yes | Industry ID from Get Industries |

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": [
    {
      "industryCategoryId": 51,
      "industryCategoryName": "Hospitals and Clinics",
      "isActive": true
    }
  ]
}
```

---

## Get Business Types

Returns all supported merchant business types.

- **Method:** `GET`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/Industry/GetBusinessTypes`
- **Auth required:** No

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": [
    { "businessTypeId": 1, "businessTypeName": "Sole Proprietorship" },
    { "businessTypeId": 2, "businessTypeName": "LLC" },
    { "businessTypeId": 3, "businessTypeName": "Individual" }
  ]
}
```

---

## Get Business Registration Types

Returns CAC registration categories.

- **Method:** `GET`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/Industry/GetBusinessRegistrationTypes`
- **Auth required:** Yes

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": [
    { "registrationTypeId": 1, "registrationTypeName": "Business Name" },
    { "registrationTypeId": 2, "registrationTypeName": "Incorporated Company" }
  ]
}
```

---

## Get Business Categories

Returns all merchant business categories.

- **Method:** `GET`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/BusinessCategory/GetBusinessCategories`
- **Auth required:** Yes

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": [
    { "businessCategoryId": 1, "categoryName": "Retail", "isActive": true },
    { "businessCategoryId": 2, "categoryName": "Food & Beverage", "isActive": true }
  ]
}
```

---

## Get All Banks

Returns a list of all Nigerian banks, used for settlement account setup.

- **Method:** `GET`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/Account/GetBanks`
- **Auth required:** Yes

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": [
    { "bankCode": "044", "bankName": "Access Bank" },
    { "bankCode": "058", "bankName": "GTBank" },
    { "bankCode": "033", "bankName": "UBA" }
  ]
}
```

---

## Get Merchant Sub-Account

Returns sub-accounts linked to the authenticated merchant.

- **Method:** `GET`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/Account/GetMerchantSubAccount`
- **Auth required:** Yes

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": [
    { "subAccountId": "sa-001", "subAccountName": "Main Account" }
  ]
}
```

---

## Get Merchant Sub-Account Group

Returns sub-account groups for the authenticated merchant.

- **Method:** `GET`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/Account/GetMerchantSubAccountGroup`
- **Auth required:** Yes

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": [
    { "subAccountGroupId": "sag-001", "groupName": "Primary Group" }
  ]
}
```
