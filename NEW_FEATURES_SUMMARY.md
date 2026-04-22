# New Features Implementation Summary

## Overview

Three major features have been implemented:

1. ✅ **Admin Invoices View** - Admin can see all invoices in the system
2. ✅ **Complaints System** - Complete complaints module for users and admins
3. ✅ **Room Images** - Separate table with image management for rooms
4. ✅ **Room Names** - Added name field to rooms

---

## 1. Admin Invoices View

### What's New

Admin users can now view **all invoices** in the system, not just their own.

### API Endpoints

**Get All Invoices** (Role-based):
```bash
# Visitors: See only their own invoices
GET /api/invoices

# Admins: See all invoices in the system
GET /api/invoices
```

**Explicit Admin Endpoint**:
```bash
GET /api/invoices/all
```

**Response for Admins**:
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "totalAmount": 500.00,
      "paidAmount": 200.00,
      "remainingAmount": 300.00,
      "status": "partial",
      "customerName": "John Doe",
      "customerEmail": "john@example.com",
      "booking": {
        "roomName": "Deluxe Room",
        "checkIn": "2025-01-20",
        "checkOut": "2025-01-25"
      },
      "payments": [...]
    }
  ]
}
```

### Files Modified

- `backend/src/modules/invoice/services/invoiceService.js`
  - Added `getAllInvoices()` method
- `backend/src/modules/invoice/controllers/invoiceController.js`
  - Updated `getAllInvoices()` to handle admin vs visitor
  - Added `getAllInvoicesAdmin()` controller
- `backend/src/modules/invoice/routes/invoiceRoutes.js`
  - Added `/all` route for explicit admin access

---

## 2. Complaints System

### Features

**For Visitors**:
- Create complaints about their stay
- View their own complaints
- Track complaint status

**For Admins**:
- View all complaints in the system
- Filter complaints by status
- Update complaint status
- Update complaint details
- Delete complaints
- View complaint statistics

### Complaint Types

- `maintenance` - Maintenance issues
- `service` - Service-related problems
- `cleanliness` - Cleanliness concerns
- `noise` - Noise complaints
- `other` - Other issues

### Complaint Statuses

- `open` - Newly created complaint
- `in_progress` - Being addressed
- `resolved` - Issue resolved
- `closed` - Complaint closed

### API Endpoints

**For All Authenticated Users**:
```bash
# Get all complaints (visitors: own, admins: all)
GET /api/complaints

# Get specific complaint
GET /api/complaints/:id

# Create new complaint
POST /api/complaints
{
  "description": "Air conditioning not working",
  "type": "maintenance"
}
```

**Admin Only**:
```bash
# Get complaints by status
GET /api/complaints/status/:status

# Get complaint statistics
GET /api/complaints/statistics/dashboard

# Update complaint
PUT /api/complaints/:id
{
  "status": "in_progress",
  "description": "Updated description"
}

# Update complaint status only
PATCH /api/complaints/:id/status
{
  "status": "resolved"
}

# Delete complaint
DELETE /api/complaints/:id
```

### Statistics Response

```json
{
  "success": true,
  "data": {
    "total": 25,
    "byStatus": {
      "open": 5,
      "inProgress": 3,
      "resolved": 15,
      "closed": 2
    },
    "byType": [
      { "type": "maintenance", "count": 10 },
      { "type": "service", "count": 8 },
      { "type": "cleanliness", "count": 5 },
      { "type": "noise", "count": 2 }
    ]
  }
}
```

### Files Created

**Backend Module**: `backend/src/modules/complaint/`
- `services/complaintService.js` - Business logic
- `controllers/complaintController.js` - Request handlers
- `routes/complaintRoutes.js` - Route definitions

**Updated**:
- `backend/src/index.js` - Mounted complaint routes

### Database

Uses `COMPLAINTS` table (renamed from `COMPLAINS`):
```sql
CREATE TABLE COMPLAINTS (
    complaint_id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255),
    type VARCHAR(45),
    VISITOR_visitor_id INT,
    FOREIGN KEY (VISITOR_visitor_id) REFERENCES VISITOR(visitor_id)
);
```

---

## 3. Room Images & Names

### What's New

**Room Names**:
- Added `name` column to ROOM table
- Display custom room names (e.g., "Ocean View Suite", "Garden Room")

**Room Images**:
- Separate `ROOM_IMAGES` table
- Multiple images per room
- Primary image designation
- Custom display order
- Captions for each image

### Database Schema

**ROOM Table** (Updated):
```sql
CREATE TABLE ROOM (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),              -- NEW
    price DECIMAL(10, 2),
    type VARCHAR(45),
    capacity INT DEFAULT 2,
    status ENUM('available', 'unavailable', 'maintenance') DEFAULT 'available',
    description TEXT NULL,
    amenities JSON NULL
);
```

**ROOM_IMAGES Table** (NEW):
```sql
CREATE TABLE ROOM_IMAGES (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    caption VARCHAR(255) NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES ROOM(room_id) ON DELETE CASCADE
);
```

### API Endpoints

**For All Authenticated Users**:
```bash
# Get all images for a room
GET /api/room-images/room/:roomId

# Get specific image
GET /api/room-images/image/:imageId
```

**Admin Only**:
```bash
# Add image to room
POST /api/room-images/room/:roomId
{
  "url": "https://example.com/image1.jpg",
  "caption": "Room view from entrance",
  "isPrimary": false
}

# Update image
PUT /api/room-images/image/:imageId
{
  "caption": "Updated caption",
  "displayOrder": 1
}

# Delete image
DELETE /api/room-images/image/:imageId

# Set image as primary
PATCH /api/room-images/image/:imageId/set-primary

# Reorder images
PUT /api/room-images/room/:roomId/reorder
{
  "images": [
    { "imageId": "1", "displayOrder": 0 },
    { "imageId": "2", "displayOrder": 1 }
  ]
}
```

### Image Object Structure

```json
{
  "id": "1",
  "roomId": "5",
  "url": "https://example.com/room-image.jpg",
  "caption": "Beautiful ocean view",
  "isPrimary": true,
  "displayOrder": 0
}
```

### Room Response with Images

```json
{
  "id": "5",
  "name": "Ocean View Suite",
  "type": "suite",
  "price": 250.00,
  "capacity": 4,
  "status": "available",
  "description": "Luxury suite with ocean view",
  "amenities": ["WiFi", "AC", "TV"],
  "images": [
    {
      "id": "1",
      "url": "https://example.com/image1.jpg",
      "caption": "Main room view",
      "isPrimary": true,
      "displayOrder": 0
    },
    {
      "id": "2",
      "url": "https://example.com/image2.jpg",
      "caption": "Bathroom",
      "isPrimary": false,
      "displayOrder": 1
    }
  ]
}
```

### Files Created

**Backend Module**: `backend/src/modules/roomImage/`
- `services/roomImageService.js` - Image CRUD operations
- `controllers/roomImageController.js` - Request handlers
- `routes/roomImageRoutes.js` - Route definitions

### Files Modified

- `backend/schema.sql` - Added ROOM_IMAGES table and name column
- `backend/src/modules/room/services/roomService.js` - Updated to handle name and images
- `backend/src/index.js` - Mounted room image routes

---

## Database Migration Required

### SQL Commands

Run these commands after updating the schema:

```sql
-- 1. Add name column to ROOM table
ALTER TABLE ROOM ADD COLUMN name VARCHAR(100) AFTER room_id;

-- 2. Create ROOM_IMAGES table
CREATE TABLE ROOM_IMAGES (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    caption VARCHAR(255) NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES ROOM(room_id) ON DELETE CASCADE
);

-- 3. Update existing rooms with default names (optional)
UPDATE ROOM SET name = CONCAT(UCASE(LEFT(type, 1)), SUBSTRING(type, 2), ' Room ', room_id) WHERE name IS NULL;

-- 4. Create index for faster queries
CREATE INDEX idx_room_image_room ON ROOM_IMAGES(room_id);
CREATE INDEX idx_room_image_primary ON ROOM_IMAGES(room_id, is_primary);
```

---

## Testing

### Test Admin Invoices

```bash
# Login as admin
TOKEN=$(curl -s -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hotel.com","password":"admin123"}' \
  | jq -r '.data.token')

# Get all invoices as admin
curl -X GET http://localhost:5000/api/invoices/all \
  -H "Authorization: Bearer $TOKEN"
```

### Test Complaints

```bash
# Create complaint (as visitor)
curl -X POST http://localhost:5000/api/complaints \
  -H "Authorization: Bearer VISITOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "AC not working properly",
    "type": "maintenance"
  }'

# Get all complaints as admin
curl -X GET http://localhost:5000/api/complaints \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Get complaint statistics
curl -X GET http://localhost:5000/api/complaints/statistics/dashboard \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Update complaint status
curl -X PATCH http://localhost:5000/api/complaints/1/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'
```

### Test Room Images

```bash
# Add image to room
curl -X POST http://localhost:5000/api/room-images/room/1 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/room1.jpg",
    "caption": "Beautiful room view",
    "isPrimary": true
  }'

# Get all images for a room
curl -X GET http://localhost:5000/api/room-images/room/1 \
  -H "Authorization: Bearer TOKEN"

# Set image as primary
curl -X PATCH http://localhost:5000/api/room-images/image/1/set-primary \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Delete image
curl -X DELETE http://localhost:5000/api/room-images/image/1 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Test Room Names

```bash
# Update room with name
curl -X PUT http://localhost:5000/api/rooms/1 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Presidential Suite",
    "price": 500,
    "type": "penthouse"
  }'

# Get room details with name
curl -X GET http://localhost:5000/api/rooms/1 \
  -H "Authorization: Bearer TOKEN"
```

---

## Frontend Integration

### Update Room Types

Update `frontend/src/types/room.types.ts`:

```typescript
export interface Room {
  id: string
  name: string              // NEW
  type: RoomType
  price: number
  capacity?: number
  status?: RoomStatus
  description?: string
  amenities?: string[]
  images: RoomImage[]       // NEW
}

export interface RoomImage {
  id: string
  url: string
  caption?: string
  isPrimary: boolean
  displayOrder: number
}
```

### Update Complaint Types

Update `frontend/src/types/booking.types.ts`:

```typescript
export interface Complaint {
  id: string
  customerId: string
  description: string
  type: ComplaintType
  status: ComplaintStatus
  response?: string
  createdAt: string
}

export type ComplaintType = 'maintenance' | 'service' | 'cleanliness' | 'noise' | 'other'
export type ComplaintStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
```

---

## Summary

### Features Implemented

✅ **Admin Invoices** - Complete visibility into all invoices
✅ **Complaints System** - Full CRUD for users and admins
✅ **Room Images** - Separate table with full management
✅ **Room Names** - Custom names for rooms

### Files Created

**Backend**:
- 3 complaint module files
- 3 room image module files

**Backend Modified**:
- `schema.sql` - Added ROOM_IMAGES table and name column
- `roomService.js` - Handle name and images
- `invoiceService.js` - Added getAllInvoices()
- `invoiceController.js` - Admin support
- `invoiceRoutes.js` - New routes
- `index.js` - Mounted new routes

### Next Steps

1. **Run database migration** (see SQL commands above)
2. **Update frontend types** for rooms and complaints
3. **Create admin UI** for complaints management
4. **Create room image upload UI**
5. **Add file upload handling** with multer for actual image files

---

**Last Updated**: 2025-01-19
**Status**: ✅ All features implemented and ready for testing
