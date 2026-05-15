# Quick Start: Database Seeding

## TL;DR - Fast Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies (if needed)
npm install

# 3. Create .env with database config (if not exists)
cp .env.example .env

# 4. Make sure MySQL is running and schema is initialized
# Option A: Docker
docker-compose up -d cse221_db

# Option B: Local MySQL
# Just ensure your MySQL service is running

# 5. Initialize schema (one-time only)
docker-compose exec cse221_db mysql -u root -prootpassword mydb < schema.sql

# 6. Seed the database
npm run seed

# 7. Start backend
npm run dev

# 8. In another terminal, start frontend
cd frontend && pnpm dev
```

## Seeded Credentials

| Role    | Email                | Password     |
|---------|----------------------|--------------|
| Admin   | admin@hotel.com      | admin123     |
| Visitor | customer@hotel.com   | customer123  |
| Visitor | jane@hotel.com       | jane123      |
| Visitor | bob@hotel.com        | bob123       |

## Available Commands

```bash
# Seed database once
npm run seed

# Seed with auto-reload (development)
npm run seed:watch

# Start backend server
npm run dev

# Start backend in production
npm start
```

## Troubleshooting

**Issue**: "Cannot find module"
```bash
npm install
```

**Issue**: "Database connection failed"
- Check MySQL is running
- Verify .env credentials
- Check `DB_HOST=cse221_db` (Docker) vs `DB_HOST=localhost` (local)

**Issue**: "Table doesn't exist"
```bash
# Import schema
docker-compose exec cse221_db mysql -u root -prootpassword mydb < schema.sql
```

**Issue**: "Duplicate entry for key 'email'"
- Re-run seed: It safely updates existing entries

## Schema Structure

```
USER (4 records)
├── admin@hotel.com (admin)
└── 3 visitor accounts
    └── VISITOR (3 records - profile info for visitors)
        ├── address
        ├── gender
        └── birthdate
```

## Testing the Seed

```bash
# After seeding, verify with:
npm run seed

# Should show:
# ✓ User created/updated: admin@hotel.com (admin)
# ✓ User created/updated: customer@hotel.com (visitor)
# ✓ User created/updated: jane@hotel.com (visitor)
# ✓ User created/updated: bob@hotel.com (visitor)
# ✓ All users seeded successfully!
# ✓ Seeding verification completed successfully!
```

## Adding More Users

Edit `backend/seed-database.js`:

```javascript
seedData.users.push({
  name: 'New User',
  email: 'new@hotel.com',
  phone: '+1-800-NEW-01',
  password: 'password123',
  role: 'visitor',
});

// For visitors, also add profile:
seedData.visitors.push({
  userEmail: 'new@hotel.com',
  address: 'Address here',
  gender: 'Male',
  birthdate: '1990-01-01',
});
```

Then run: `npm run seed`

## Data Flow

```
Frontend Mock Data (users.ts)
        ↓
Backend seed-database.js
        ↓
Database (MySQL)
        ↓
Backend API
        ↓
Frontend (using real backend)
```

## Files Created

- `backend/seed-database.js` - Main seeding script
- `backend/SEEDING_GUIDE.md` - Detailed documentation
- `backend/setup-db.sh` - Automated setup script
- `backend/package.json` - Updated with seed commands

## Security Notes

- Passwords hashed with bcryptjs (10 salt rounds)
- Safe to re-run: Uses ON DUPLICATE KEY UPDATE
- For production: Use environment variables for sensitive data
