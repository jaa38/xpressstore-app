# Auth Endpoints

> Base URL: `https://sso.xpresspayments.com:2503/api/v2/`
> No auth required unless noted.

---

## Register

Creates a new merchant storefront account. An OTP is sent to the provided email.

- **Method:** `POST`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/StoreFront/CreateUserStoreFront`
- **Auth required:** No

**Request Body**

```json
{
  "email": "merchant@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+2348012345678"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Merchant email |
| `firstName` | string | Yes | First name |
| `lastName` | string | Yes | Last name |
| `phoneNumber` | string | Yes | Phone with country code |

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Account created successfully",
  "data": null
}
```

**Error Response**

```json
{
  "responseCode": "99",
  "responseMessage": "Email already exists",
  "data": null
}
```

---

## Login

Authenticates a merchant and returns a JWT token. Credentials must be Base64-encoded.

- **Method:** `POST`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/StoreFront/Login`
- **Auth required:** No

> **Note:** The app encodes credentials as `base64(utf8(value))` before sending.

**Request Body**

```json
{
  "email": "<base64_encoded_email>",
  "password": "<base64_encoded_password>"
}
```

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Login successful",
  "data": {
    "token": {
      "jwtToken": "eyJhbGci...",
      "refreshToken": "dGhpcyBpcy...",
      "tokenExpireOn": "2026-08-01T13:00:00"
    },
    "data": {
      "firstName": "John",
      "middleName": "",
      "lastName": "Doe",
      "email": "merchant@example.com",
      "isEmailVerified": true,
      "phoneNumber": "+2348012345678",
      "roleName": "Merchant",
      "isMerchantuserAdmin": true,
      "merchantDetails": {
        "merchantId": "M12345",
        "businessName": "My Business",
        "bvn": "12345678901"
      }
    }
  }
}
```

---

## Verify Email / OTP

Verifies the OTP sent to the user's email after registration.

- **Method:** `POST`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/StoreFront/VerifyUserEmail`
- **Auth required:** No

**Request Body**

```json
{
  "email": "merchant@example.com",
  "otp": "123456"
}
```

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Email verified successfully",
  "data": {
    "token": {
      "jwtToken": "eyJhbGci...",
      "refreshToken": "dGhpcyBpcy...",
      "tokenExpireOn": "2026-08-01T13:00:00"
    },
    "data": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "merchant@example.com",
      "isEmailVerified": true,
      "merchantDetails": {}
    }
  }
}
```

---

## Resend OTP

Resends the email verification OTP.

- **Method:** `POST`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/StoreFront/UpdateUserEmailVerification?Email={email}`
- **Auth required:** Yes

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `Email` | string | Yes | Email address to resend OTP to |

**Request Body:** None

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "OTP sent successfully",
  "data": null
}
```

---

## Fetch Storefront User

Fetches the authenticated merchant's full profile by token.

- **Method:** `GET`
- **URL:** `https://api.myxpresspay.com/api/Merchants/FetchStorefrontUser?token={token}`
- **Auth required:** No

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `token` | string | Yes | JWT token from login |

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": {
    "token": "eyJhbGci...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "merchant@example.com",
    "merchantId": "M12345"
  }
}
```

---

## Update Password (Post-Registration)

Sets the user's password after email verification.

- **Method:** `POST`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/StoreFront/UpdateUserPassword`
- **Auth required:** No

**Request Body**

```json
{
  "email": "merchant@example.com",
  "password": "NewSecureP@ss1",
  "confirmPassword": "NewSecureP@ss1"
}
```

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Password updated successfully",
  "data": null
}
```

---

## Forgot Password

Sends a password reset link to the email address.

- **Method:** `POST`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/Account/ForgetPassword?EmailAddress={email}`
- **Auth required:** No

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `EmailAddress` | string | Yes | Registered email address |

**Request Body:** None

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Password reset email sent",
  "data": null
}
```

---

## Change Password (Mobile)

Changes the authenticated user's password.

- **Method:** `POST`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/Account/ChangePasswordMobile`
- **Auth required:** Yes

**Request Body**

```json
{
  "oldPassword": "OldP@ss1",
  "newPassword": "NewSecureP@ss1"
}
```

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Password changed successfully",
  "data": null
}
```

---

## Update Merchant Business Details

Updates core business information for the merchant.

- **Method:** `POST`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/StoreFront/UpdateMerchantBusinessDetails`
- **Auth required:** Yes

**Request Body**

```json
{
  "merchantId": "M12345",
  "businessName": "Acme Stores",
  "tradingName": "Acme",
  "businessEmail": "acme@example.com",
  "businessPhoneNumber": "+2348012345678"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `merchantId` | string | Yes | Merchant ID |
| `businessName` | string | Yes | Registered business name |
| `tradingName` | string | Yes | Trading / brand name |
| `businessEmail` | string | Yes | Business email |
| `businessPhoneNumber` | string | Yes | Business phone number |

**Success Response — `200 OK`**

```json
{
  "responseCode": "0",
  "responseMessage": "Business details updated",
  "data": null
}
```

---

## Update Merchant Business Type

Updates the merchant's business type classification.

- **Method:** `POST`
- **URL:** `https://sso.xpresspayments.com:2503/api/v2/StoreFront/UpdateMerchantBusinessType`
- **Auth required:** Yes

**Request Body**

```json
{
  "merchantId": "M12345",
  "businessTypeId": 2,
  "businessRegistrationTypeId": 1
}
```

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Business type updated",
  "data": null
}
```
