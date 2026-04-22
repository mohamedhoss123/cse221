# Automatic Invoice Status Update Feature

## Overview

When payments are made for an invoice, the invoice status now **automatically updates** in the database to reflect the current payment state.

## Implementation Details

### Status Update Logic

The invoice status is automatically calculated and updated based on the total paid amount:

| Paid Amount | Status |
|------------|--------|
| $0 | `pending` |
| > $0 but < total | `partial` |
| >= total | `paid` |

### When Status Updates

The invoice status is automatically updated in the following scenarios:

1. **When a payment is created** - After each payment, the invoice status is recalculated and updated
2. **When a payment is deleted** (admin only) - Status is recalculated based on remaining payments
3. **Manual status update** (admin only) - Can trigger recalculation for a specific invoice
4. **Bulk status update** (admin only) - Can recalculate all invoice statuses at once

## API Endpoints

### 1. Create Payment (Updates Invoice Status)

**Endpoint**: `POST /api/payments/invoices/:id/payment`

**Description**: Creates a payment for an invoice and automatically updates the invoice status.

**Request Body**:
```json
{
  "amount": 100.00,
  "method": "credit_card"
}
```

**Response**: Returns the updated invoice with new status and payment details.

**Example**:
```bash
curl -X POST http://localhost:5000/api/payments/invoices/1/payment \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 150.00,
    "method": "credit_card"
  }'
```

**Response**:
```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "id": "1",
    "totalAmount": 500.00,
    "paidAmount": 150.00,
    "remainingAmount": 350.00,
    "status": "partial",
    "payments": [...]
  }
}
```

### 2. Update Invoice Status (Admin Only)

**Endpoint**: `PUT /api/payments/invoices/:id/status`

**Description**: Manually trigger status recalculation for a specific invoice.

**Response**:
```json
{
  "success": true,
  "message": "Invoice status updated successfully",
  "data": {
    "invoiceId": "1",
    "previousStatus": "partial",
    "newStatus": "paid",
    "totalAmount": 500.00,
    "paidAmount": 500.00,
    "remainingAmount": 0.00
  }
}
```

### 3. Update All Invoice Statuses (Admin Only)

**Endpoint**: `PUT /api/payments/invoices/update-all-statuses`

**Description**: Recalculate and update all invoice statuses. Useful for:
- Data migration after schema changes
- Fixing inconsistent statuses
- Bulk maintenance operations

**Response**:
```json
{
  "success": true,
  "message": "Updated 15 invoice statuses",
  "data": {
    "totalInvoices": 50,
    "updatedCount": 15,
    "updates": [
      {
        "invoiceId": "1",
        "previousStatus": "pending",
        "newStatus": "paid"
      },
      ...
    ]
  }
}
```

### 4. Delete Payment (Admin Only)

**Endpoint**: `DELETE /api/payments/payments/:paymentId`

**Description**: Delete a payment and automatically recalculate the invoice status.

**Response**:
```json
{
  "success": true,
  "message": "Payment deleted successfully",
  "data": {
    "paymentId": "123",
    "deletedAmount": 100.00,
    "invoiceId": "1",
    "statusUpdate": {
      "previousStatus": "paid",
      "newStatus": "partial"
    }
  }
}
```

## Database Changes

The `INVOICE` table now has a `status` column that is automatically maintained:

```sql
ALTER TABLE INVOICE ADD COLUMN status ENUM('pending', 'partial', 'paid', 'overdue') DEFAULT 'pending';
```

### Status Values

- **`pending`**: No payments made yet
- **`partial`**: Some payments made, but not fully paid
- **`paid`**: Fully paid
- **`overdue`**: (Reserved for future use) Payment past due date

## Backend Implementation

### Payment Service (`paymentService.js`)

**New/Updated Methods**:

1. **`createPaymentForInvoice()`** - Updated to:
   - Calculate new status after payment
   - Update invoice status in database
   - Return updated invoice with new status

2. **`updateInvoiceStatus(invoiceId)`** - NEW:
   - Recalculates status based on payments
   - Updates database with new status
   - Returns status change details

3. **`updateAllInvoiceStatuses()`** - NEW:
   - Loops through all invoices
   - Recalculates each status
   - Updates only changed statuses
   - Returns summary of updates

4. **`deletePayment(paymentId)`** - NEW:
   - Deletes the payment
   - Recalculates invoice status
   - Returns deletion details and status update

### Invoice Service (`invoiceService.js`)

**Already configured correctly**:
- Uses database status when available: `invoice.status || calculateInvoiceStatus(...)`
- Falls back to calculation for old invoices without status
- Returns accurate status in all API responses

## Migration Guide

### For Existing Data

If you have existing invoices without status values, run the bulk update:

```bash
curl -X PUT http://localhost:5000/api/payments/invoices/update-all-statuses \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

This will:
1. Calculate all invoice statuses based on existing payments
2. Update the database with correct statuses
3. Return a summary of changes

### After Database Migration

When you migrate the database schema (see REFACTORING_SUMMARY.md), existing invoices will have `status = NULL`. Run the bulk update immediately after migration:

```bash
# 1. Migrate database
mysql -u root -p mydb < backend/schema.sql

# 2. Start backend
docker-compose up

# 3. Update all invoice statuses
curl -X PUT http://localhost:5000/api/payments/invoices/update-all-statuses \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## Testing

### Test Case 1: Partial Payment

```bash
# Create invoice with $500 total
# Payment 1: $200 → status should be "partial"
curl -X POST http://localhost:5000/api/payments/invoices/1/payment \
  -H "Authorization: Bearer TOKEN" \
  -d '{"amount": 200, "method": "credit_card"}'

# Expected response: status = "partial", paidAmount = 200, remainingAmount = 300
```

### Test Case 2: Full Payment

```bash
# Continue with $300 more → status should change to "paid"
curl -X POST http://localhost:5000/api/payments/invoices/1/payment \
  -H "Authorization: Bearer TOKEN" \
  -d '{"amount": 300, "method": "credit_card"}'

# Expected response: status = "paid", paidAmount = 500, remainingAmount = 0
```

### Test Case 3: Delete Payment

```bash
# Delete $200 payment → status should revert to "partial"
curl -X DELETE http://localhost:5000/api/payments/payments/123 \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Expected response: previousStatus = "paid", newStatus = "partial"
```

## Frontend Integration

The frontend will automatically see updated statuses when:

1. **After payment**: The response includes the updated invoice with new status
2. **Refresh invoice details**: Fetching the invoice again shows current status
3. **Real-time updates**: Consider implementing WebSocket/polling for live updates

### Example: React Component

```tsx
// After making a payment
const response = await createPaymentForInvoice(invoiceId, amount, method);

// Response includes updated status
console.log(response.data.status); // "partial" or "paid"

// Update UI accordingly
if (response.data.status === 'paid') {
  // Show success message, disable payment button, etc.
}
```

## Benefits

✅ **Automatic Status Tracking**: No manual status updates needed
✅ **Data Consistency**: Status always reflects actual payment state
✅ **Backwards Compatible**: Works with existing invoices
✅ **Admin Tools**: Bulk update and manual override available
✅ **Accurate Reporting**: Status column can be used for queries and analytics

## Future Enhancements

Possible improvements:
- **Overdue detection**: Automatically mark invoices as `overdue` when due_date passes
- **Payment reminders**: Trigger notifications when status is `pending` or `partial`
- **Status history**: Track status changes over time
- **Partial payment rules**: Define minimum payment requirements

---

**Last Updated**: 2025-01-19
**Status**: ✅ Implemented and ready for use
