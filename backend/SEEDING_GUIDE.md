# Database Seeding Guide

## Overview

The database seeding system automatically populates your hotel management system with initial users and visitor profiles. It pulls data from the frontend mock data structure and seeds it into the MySQL database.

## Seed Data Structure

### Users
The seeding script creates two types of users:

#### Admin User
- **Email**: `admin@hotel.com`
- **Password**: `admin123`
- **Name**: Admin User
- **Phone**: +1-800-HOTEL-01
- **Role**: `admin`

#### Visitor Users
- **Customer User**
  - Email: `customer@hotel.com`
  - Password: `customer123`
  - Name: John Customer
  - Phone: +1-800-CUSTOMER-01
  - Role: `visitor`

- **Jane Doe**
  - Email: `jane@hotel.com`
  - Password: `jane123`
  - Phone: +1-800-JANE-01
  - Role: `visitor`

- **Bob Smith**
  - Email: `bob@hotel.com`
  - Password: `bob123`
  - Phone: +1-800-BOB-01
  - Role: `visitor`

### Visitor Profiles
Visitor profiles are created for non-admin users with additional information:

| Email | Address | Gender | Birthdate |
|-------|---------|--------|-----------|
| customer@hotel.com | 123 Main St, New York, NY 10001 | Male | 1990-05-15 |
| jane@hotel.com | 456 Oak Ave, Los Angeles, CA 90001 | Female | 1992-08-22 |
| bob@hotel.com | 789 Pine Rd, Chicago, IL 60601 | Male | 1988-03-10 |

## Running the Seed Script

### Prerequisites
1. **Database Running**: Ensure MySQL is running on the configured port
2. **Schema Initialized**: Run the schema first with `backend/schema.sql`
3. **Environment Variables**: Ensure `.env` file is configured with correct database credentials

### Command

```bash
# Navigate to backend directory
cd backend

# Run seeding script
npm run seed

# Run with auto-reload (useful during development)
npm run seed:watch
```

### Example Output

```
╔════════════════════════════════════════════╗
║    Hotel Management Database Seeding       ║
╚════════════════════════════════════════════╝

🌱 Seeding users...
✓ User created/updated: admin@hotel.com (admin)
✓ User created/updated: customer@hotel.com (visitor)
✓ User created/updated: jane@hotel.com (visitor)
✓ User created/updated: bob@hotel.com (visitor)
✓ All users seeded successfully!

🌱 Seeding visitor profiles...
✓ Visitor profile created/updated for: customer@hotel.com
✓ Visitor profile created/updated for: jane@hotel.com
✓ Visitor profile created/updated for: bob@hotel.com
✓ All visitor profiles seeded successfully!

📋 Verification Report:
==================================================

User Counts by Role:
  • admin: 1
  • visitor: 3

All Users:
  • [1] Admin User (admin@hotel.com) - admin
  • [2] John Customer (customer@hotel.com) - visitor
  • [3] Jane Doe (jane@hotel.com) - visitor
  • [4] Bob Smith (bob@hotel.com) - visitor

Visitor Profiles: 3

Visitor Details:
  • [1] John Customer (customer@hotel.com)
    Address: 123 Main St, New York, NY 10001
    Gender: Male, Birthdate: 1990-05-15
  • [2] Jane Doe (jane@hotel.com)
    Address: 456 Oak Ave, Los Angeles, CA 90001
    Gender: Female, Birthdate: 1992-08-22
  • [3] Bob Smith (bob@hotel.com)
    Address: 789 Pine Rd, Chicago, IL 60601
    Gender: Male, Birthdate: 1988-03-10

==================================================
✓ Seeding verification completed successfully!

🎉 Database seeding completed successfully!
```

## Adding Custom Seed Data

To add more users to the seeding process:

1. **Edit `backend/seed-database.js`**
2. **Add entries to `seedData.users`** array:

```javascript
{
  name: 'Your Name',
  email: 'your.email@hotel.com',
  phone: '+1-800-CUSTOM-01',
  password: 'password123',
  role: 'visitor', // or 'admin'
}
```

3. **If it's a visitor, add to `seedData.visitors`**:

```javascript
{
  userEmail: 'your.email@hotel.com',
  address: 'Your Address',
  gender: 'Male', // or 'Female', 'Other'
  birthdate: '1990-01-01',
}
```

4. **Run the seed script again**:

```bash
npm run seed
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs with salt rounds = 10
- **Duplicate Prevention**: Uses `ON DUPLICATE KEY UPDATE` to safely handle re-runs
- **Data Validation**: Ensures referential integrity between USER and VISITOR tables

## Troubleshooting

### Error: "Database connection failed"
- **Solution**: Check that MySQL is running and credentials in `.env` are correct

### Error: "Table doesn't exist"
- **Solution**: Initialize the schema first by importing `backend/schema.sql` into your database

### Error: "Foreign key constraint fails"
- **Solution**: Ensure the USER table exists and the email is unique

### Script runs but doesn't create visitors
- **Solution**: Verify that the user email in the visitors section matches exactly with a user in the users section

## Database Queries

### View all users
```sql
SELECT * FROM USER;
```

### View all visitors
```sql
SELECT * FROM VISITOR;
```

### View user with visitor details
```sql
SELECT u.*, v.* FROM USER u
LEFT JOIN VISITOR v ON u.user_id = v.user_id;
```

### Verify password for a user
```sql
SELECT email, role FROM USER WHERE email = 'admin@hotel.com';
```

## Development Workflow

1. **Initialize Database**: Run schema
2. **Seed Data**: Run `npm run seed`
3. **Start Backend**: Run `npm run dev`
4. **Login**: Use seeded credentials to test

## Notes

- Passwords in seed data are plain text for development purposes only
- In production, use environment variables or a secure secrets manager
- The `ON DUPLICATE KEY UPDATE` clause allows safe re-runs of the seeding script
- All passwords are hashed before storage using bcryptjs
