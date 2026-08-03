# Dashboard Endpoints

> Base URL: `https://api.myxpresspay.com/api/`
> All endpoints require **Bearer token**.

---

## Get Dashboard Summary

Returns summary metrics for the merchant dashboard with optional date filtering.

- **Method:** `GET`
- **URL:** `https://api.myxpresspay.com/api/Store/dashboard?filter={duration}&fromDate={fromDate}&toDate={toDate}`
- **Auth required:** Yes

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `filter` | integer | No | Duration shortcut (e.g. `7` = last 7 days, `30` = last 30 days) |
| `fromDate` | string | No | Start date in `YYYY-MM-DD` format |
| `toDate` | string | No | End date in `YYYY-MM-DD` format |

**Request Body:** None

**Success Response — `200 OK`**

```json
{
  "responseCode": "00",
  "responseMessage": "Success",
  "data": {
    "summary": {
      "totalRevenue": 500000.00,
      "totalOrders": 120,
      "totalProducts": 45
    },
    "stats": {
      "successfulTransactions": 110,
      "failedTransactions": 10
    },
    "recentTransactions": [
      {
        "transactionId": "TXN001",
        "amount": 5000.00,
        "status": "Successful",
        "dateCreated": "2026-07-30T10:30:00"
      }
    ]
  }
}
```

| Response Field | Type | Description |
|----------------|------|-------------|
| `summary.totalRevenue` | number | Total revenue in the period |
| `summary.totalOrders` | integer | Total number of orders |
| `summary.totalProducts` | integer | Total active products |
| `stats.successfulTransactions` | integer | Count of successful transactions |
| `stats.failedTransactions` | integer | Count of failed transactions |
| `recentTransactions` | array | Latest transactions list |
