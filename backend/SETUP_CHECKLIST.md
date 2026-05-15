# Database Seeding Setup Checklist

Complete this checklist to get your database seeding working:

## Prerequisites
- [ ] MySQL 8.0+ installed or Docker available
- [ ] Node.js and npm installed
- [ ] Backend repository cloned
- [ ] `.env` file created with database credentials

## Step 1: Environment Setup
- [ ] Copy `.env.example` to `.env` (if needed)
- [ ] Verify `DB_HOST` is correct:
  - Local MySQL: `localhost`
  - Docker: `cse221_db`
- [ ] Verify `DB_USER` and `DB_PASSWORD` match your setup
- [ ] Verify `DB_NAME` is `mydb` (or your database name)

## Step 2: Database Initialization
- [ ] MySQL service is running
  - Option A (Docker): `docker-compose up -d cse221_db`
  - Option B (Local): MySQL service running on port 3306
- [ ] Database `mydb` exists
- [ ] Schema is imported: `schema.sql`
  - Option A: `docker-compose exec cse221_db mysql -u root -prootpassword mydb < schema.sql`
  - Option B: `mysql -u root -p mydb < schema.sql`
- [ ] Verify tables exist:
  ```sql
  SHOW TABLES;  -- Should see: USER, VISITOR, ROOM, etc.
  ```

## Step 3: Backend Setup
- [ ] Navigate to backend: `cd backend`
- [ ] Install dependencies: `npm install`
- [ ] Verify bcryptjs installed: `npm list bcryptjs`
- [ ] Verify mysql2 installed: `npm list mysql2`

## Step 4: Run Seeding
- [ ] Run: `npm run seed`
- [ ] Verify output shows:
  - [ ] "✓ All users seeded successfully!"
  - [ ] "✓ All visitor profiles seeded successfully!"
  - [ ] "✓ Seeding verification completed successfully!"
  - [ ] "🎉 Database seeding completed successfully!"

## Step 5: Verify Results

### Check Users Table
```bash
npm run seed  # Output shows:
# ✓ User created/updated: admin@hotel.com (admin)
# ✓ User created/updated: customer@hotel.com (visitor)
# ✓ User created/updated: jane@hotel.com (visitor)
# ✓ User created/updated: bob@hotel.com (visitor)
```

### Check Database Directly
```sql
-- Connect to database
mysql -u root -p mydb

-- List all users
SELECT user_id, name, email, role FROM USER;

-- Should show:
-- 1 | Admin User      | admin@hotel.com    | admin
-- 2 | John Customer   | customer@hotel.com | visitor
-- 3 | Jane Doe        | jane@hotel.com     | visitor
-- 4 | Bob Smith       | bob@hotel.com      | visitor

-- List visitors
SELECT * FROM VISITOR;

-- Should show 3 records (no admin visitor profile)
```

## Step 6: Start Services
- [ ] Start backend: `npm run dev`
  - Verify: "Server running on port 5000"
- [ ] In another terminal, start frontend: `cd ../frontend && pnpm dev`
  - Verify: "VITE v..." shows in output

## Step 7: Test Login
- [ ] Open browser: `http://localhost:3000`
- [ ] Try admin login:
  - Email: `admin@hotel.com`
  - Password: `admin123`
  - Expected: Dashboard shows
- [ ] Try visitor login:
  - Email: `customer@hotel.com`
  - Password: `customer123`
  - Expected: User profile shows

## Troubleshooting

### ❌ "Error: connect ECONNREFUSED"
- **Cause**: MySQL not running
- **Solution**:
  - Docker: `docker-compose up -d cse221_db`
  - Local: Start MySQL service

### ❌ "Error: Unknown database 'mydb'"
- **Cause**: Database doesn't exist
- **Solution**:
  - Create database: `CREATE DATABASE mydb;`
  - Import schema: `mysql -u root -p mydb < schema.sql`

### ❌ "Error: Table 'mydb.USER' doesn't exist"
- **Cause**: Schema not imported
- **Solution**:
  - Import schema: `mysql -u root -p mydb < schema.sql`
  - Verify: `SHOW TABLES;`

### ❌ "Error: Access denied for user"
- **Cause**: Wrong credentials in .env
- **Solution**:
  - Check `.env` DB_USER and DB_PASSWORD
  - Test MySQL connection: `mysql -u root -p`

### ❌ "npm ERR! Cannot find module 'bcryptjs'"
- **Cause**: Dependencies not installed
- **Solution**: `npm install`

### ❌ "Duplicate entry for key 'PRIMARY'"
- **Cause**: Running on non-empty database
- **Solution**:
  - Safe to re-run: `npm run seed` (uses ON DUPLICATE KEY UPDATE)
  - Or reset: `docker-compose down -v && docker-compose up -d`

## Verification Commands

```bash
# 1. Check seeding output
npm run seed

# 2. Verify database connection
node -e "const {query} = require('./src/database/connection'); query('SELECT 1').then(() => console.log('✓ DB connected')).catch(e => console.error('✗', e.message))"

# 3. Check user count
mysql -u root -prootpassword mydb -e "SELECT COUNT(*) as user_count FROM USER;"

# 4. Check visitor count
mysql -u root -prootpassword mydb -e "SELECT COUNT(*) as visitor_count FROM VISITOR;"

# 5. Verify backend starts
npm run dev  # Should show: "Server running on port 5000"
```

## Quick Start (Copy & Paste)

```bash
# Backend setup
cd backend
npm install
npm run seed

# Start services
npm run dev  # Terminal 1

# Terminal 2
cd frontend
pnpm dev

# Browser
# http://localhost:3000
# Login with: admin@hotel.com / admin123
```

## Files Created

- ✅ `seed-database.js` - Seeding script
- ✅ `setup-db.sh` - Automated setup
- ✅ `SEEDING_GUIDE.md` - Detailed docs
- ✅ `SEED_QUICK_START.md` - Quick reference
- ✅ `SETUP_CHECKLIST.md` - This file
- ✅ `package.json` - Updated with commands

## Support

For issues, check:
1. [SEED_QUICK_START.md](./SEED_QUICK_START.md) - Common issues
2. [SEEDING_GUIDE.md](./SEEDING_GUIDE.md) - Detailed guide
3. `.env` file - Database credentials
4. Database logs: `docker-compose logs cse221_db`
5. Backend logs: `npm run dev` output

## Next Steps

After seeding works:
1. ✅ Create a booking (as visitor)
2. ✅ Create a payment
3. ✅ Submit a complaint
4. ✅ Test admin dashboard
5. ✅ Test room management

---

**Last Updated**: May 14, 2026
**Version**: 1.0
