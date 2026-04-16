# 🏨 Hotel Management System - Requirements Specification

## 📌 Overview
This system is a hotel management platform with two main roles:
- Customer (Guest)
- Admin

The system allows customers to browse rooms, make bookings, and manage their reservations, while admins manage rooms, bookings, complaints, payments, and analytics.

---

# 👥 Roles

## 1. Customer
- Register / Login
- Search rooms
- Make bookings
- View and manage bookings
- View payment history
- Submit complaints

## 2. Admin
- Manage rooms
- View and manage bookings
- View payment history
- Handle complaints
- View analytics

---

# 🧑‍💻 Customer Pages

## 🔐 Authentication
- Login Page
- Register Page

---

## 🏠 Home Page
- Hotel overview
- Search form:
  - Check-in date
  - Check-out date
  - Number of guests

---

## 🔍 Search Results Page
- List available rooms
- Filters:
  - Price range
  - Room type
  - Amenities

---

## 🛏️ Room Details Page
- Room images
- Description
- Amenities
- Price per night
- Availability
- "Book Now" button

---

## 📅 Booking Page (Checkout)
- Enter booking details:
  - Guest info
  - Dates
  - Number of guests
- Payment method
- Confirm booking

---

## ✅ Booking Confirmation Page
- Booking ID
- Summary of reservation

---

## 👤 Profile Page
- View and edit personal information

---

## 📖 My Bookings Page
- List of bookings:
  - Upcoming
  - Completed
- Actions:
  - Cancel booking
  - Modify booking

---

## 📄 Booking Details Page
- Full booking information
- Payment status

---

## 💳 Payment History Page
- List of all transactions

---

## ⚠️ Complaints Page
- Submit complaint
- View complaint status

---

# 🛠️ Admin Pages

## 📊 Dashboard
- Metrics:
  - Total bookings
  - Total revenue
  - Occupancy rate
- Charts:
  - Revenue over time
  - Booking trends

---

## 🛏️ Room Management

### Rooms List Page
- View all rooms
- Filter by:
  - Type
  - Availability

### Create / Edit Room Page
- Fields:
  - Name
  - Type
  - Price
  - Amenities
  - Images

### Room Availability Page
- Calendar view of bookings per room

---

## 📅 Booking Management

### All Bookings Page
- View all bookings
- Filter by:
  - Date
  - Status

### Booking Details Page
- View full details
- Update status:
  - Confirmed
  - Cancelled
  - Completed

---

## 💳 Payments

### Payment History Page
- View all payments
- Filter by:
  - Date
  - Customer

### Refund Management (Optional)
- Issue refunds
- Track refund status

---

## ⚠️ Complaints Management

### Complaints List Page
- View all complaints

### Complaint Details Page
- View complaint details
- Respond to complaint
- Update status:
  - Open
  - In Progress
  - Resolved

---

## 📈 Analytics Page
- Revenue reports
- Booking trends
- Most booked rooms
- Peak seasons

---

## 👥 User Management (Optional)
- Manage users:
  - Customers
  - Admins
- Assign roles

---

# 🧠 Functional Requirements

## Booking
- A customer can create a booking
- A booking must include:
  - Room ID
  - Customer ID
  - Dates
  - Status

---

## Payments
- Each booking has a payment record
- Payment status:
  - Pending
  - Paid
  - Refunded

---

## Complaints
- Customers can submit complaints
- Admin can update complaint status

---

## Rooms
- Admin can:
  - Create room
  - Update room
  - Delete room

---

# 🔐 Authorization
- Role-based access control (RBAC)
- Customer cannot access admin routes
- Admin has full access

---

# 🔁 API Response Format

All API responses must follow this structure:

```json
{
  "status": "SUCCESS | ERROR",
  "data": {}
}
