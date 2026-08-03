# KYC Endpoints

> Base URL: `https://sso.xpresspayments.com:2503/api/v2/`
> All endpoints require **Bearer token** unless noted.

---

## Get All KYC Tiers

Returns all available KYC tiers for merchant onboarding.

- **Method:** `GET`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/kycTiers/GetAllkycTiers`
- **Auth required:** Yes

**Request Body:** None

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": [
    {
      "kycTierId": "tier-uuid",
      "tierName": "Tier 1",
      "description": "Basic KYC",
      "isActive": true
    }
  ]
}
```

---

## Get KYC Requirements by Tier

Returns the list of documents required for a specific KYC tier.

- **Method:** `GET`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/KycTiers/GetKycRequirementByKycTier?kycTierId={kycTierId}`
- **Auth required:** Yes

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `kycTierId` | string | Yes | KYC tier identifier |

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": [
    {
      "kycRequirementId": 1,
      "requirementName": "BVN",
      "isRequired": true
    }
  ]
}
```

---

## Create Merchant KYC

Submits KYC data for a merchant via the gateway route.

- **Method:** `POST`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/MerchantKyc/CreateMerchantKyc`
- **Auth required:** Yes

**Request Body**

```json
{
  "merchantId": "M12345",
  "kycTierId": "tier-uuid",
  "documentType": "NIN",
  "documentUrl": "https://cdn.example.com/document.pdf"
}
```

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "KYC submitted",
  "data": null
}
```

---

## Create Merchant KYC (StoreFront)

Submits KYC data via the StoreFront onboarding flow.

- **Method:** `POST`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/StoreFront/CreateMerchantKycStoreFront`
- **Auth required:** Yes

**Request Body**

```json
{
  "merchantId": "M12345",
  "kycTierId": "tier-uuid",
  "documentType": "CAC",
  "documentUrl": "https://cdn.example.com/cac.pdf",
  "bvn": "12345678901"
}
```

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "KYC submitted successfully",
  "data": null
}
```

---

## Get Merchant KYC

Retrieves all KYC submissions for a given merchant.

- **Method:** `GET`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/MerchantKyc/GetMerchantKycAll?merchantId={merchantId}`
- **Auth required:** Yes

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `merchantId` | string | Yes | Merchant ID |

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": [
    {
      "kycId": 1,
      "documentType": "BVN",
      "status": "Approved",
      "dateSubmitted": "2026-01-15T10:00:00"
    }
  ]
}
```

---

## Upload KYC Document

Uploads a KYC document file. Uses `multipart/form-data`.

- **Method:** `POST`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/FileUploader/UploadDocument`
- **Auth required:** Yes
- **Content-Type:** `multipart/form-data`

**Form Fields**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | Document file (image or PDF) |

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Uploaded successfully",
  "data": {
    "url": "https://cdn.example.com/documents/doc.pdf",
    "filename": "doc.pdf"
  }
}
```

---

## Verify BVN

Fetches BVN details for identity verification.

- **Method:** `GET`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/Validator/GetBVNDetails?BVN={bvn}`
- **Auth required:** Yes

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `BVN` | string | Yes | Bank Verification Number (11 digits) |

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": {
    "bvn": "12345678901",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-01",
    "phoneNumber": "08012345678"
  }
}
```

---

## Get Business Details

Looks up a registered business by its CAC / RC number.

- **Method:** `GET`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/Validator/GetBusinessDetails?RegistrationNumber={rcNumber}`
- **Auth required:** Yes

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `RegistrationNumber` | string | Yes | CAC registration / RC number |

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": {
    "companyName": "Acme Ltd",
    "rcNumber": "RC123456",
    "status": "Active",
    "registrationDate": "2015-06-01"
  }
}
```
