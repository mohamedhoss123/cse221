

# 🏨 Hotel Management System – Requirements Design (Updated)

## 1. 📌 System Overview

A web-based system to manage:

-   Rooms

-   Reservations

-   Guests

-   Payments

-   Staff operations


----------

## 2. 👥 User Roles

### Guest (Customer)

-   Register / login

-   Search rooms

-   Book rooms

-   View / cancel bookings

-   Make payments


### Receptionist / Reservation Manager

-   Create bookings manually

-   Check-in / check-out guests

-   Assign rooms

-   Manage guest data


### Admin

-   Full system control

-   Manage rooms, users, pricing

-   View reports


----------

## 3. 🧩 Functional Requirements

## 🔐 Authentication

-   Login / logout

-   Role-based access control

-   Password reset


----------

## 🛏️ Room Management

-   CRUD rooms

-   Attributes:

    -   room_number

    -   type (single, double, suite)

    -   capacity

    -   price_per_night

    -   status:

        -   available

        -   occupied

        -   maintenance


----------

## 📅 Reservation Management

-   Search rooms by:

    -   date range

    -   type

    -   capacity

-   Create / update / cancel reservations

-   Prevent double booking (HARD constraint)


----------

## 🧾 Booking Workflow

1.  Select dates

2.  Show available rooms

3.  Select room

4.  Enter guest info

5.  Confirm booking

6.  Payment


----------

## 🧍 Guest Management

-   Store:

    -   full_name

    -   phone

    -   email

    -   ID/passport

-   View booking history


----------

## 💳 Payment Management

-   Methods:

    -   cash

    -   card

    -   online

-   Track:

    -   status (pending, paid, refunded)

-   Generate invoice


----------

## 🚪 Check-in / Check-out

-   Check-in:

    -   assign room

    -   status → occupied

-   Check-out:

    -   calculate bill

    -   status → available


----------

## 📊 Reports

-   Occupancy rate

-   Revenue

-   Booking trends


----------

## ⚙️ Admin Controls

-   Manage users

-   Manage pricing

-   Discounts / promotions
