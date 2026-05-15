#!/bin/bash

# Hotel Management System - Database Setup Script
# This script initializes the database and seeds it with sample data

set -e  # Exit on any error

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  Hotel Management System - DB Setup        ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    echo "   cd backend && bash setup-db.sh"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found"
    echo "   Please create .env with database configuration"
    exit 1
fi

echo "📋 Step 1: Checking MySQL connection..."
# Note: This is a simple check. In production, use proper MySQL CLI checks
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL CLI not found. Ensure MySQL is running and configured in .env"
else
    echo "✓ MySQL CLI found"
fi

echo ""
echo "📋 Step 2: Installing dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
    echo "✓ Dependencies installed"
else
    echo "✓ Dependencies already installed"
fi

echo ""
echo "📋 Step 3: Initializing database schema..."
echo "⚠️  Make sure to manually import schema.sql to your database:"
echo "   1. Open MySQL client"
echo "   2. Run: source backend/schema.sql"
echo "   OR"
echo "   docker-compose exec cse221_db mysql -u root -prootpassword mydb < backend/schema.sql"
echo ""
read -p "Have you imported the schema? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please import the schema first and run this script again"
    exit 1
fi

echo ""
echo "📋 Step 4: Seeding database with initial data..."
npm run seed

echo ""
echo "✅ Database setup completed successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. Start backend: npm run dev"
echo "   2. Start frontend: cd ../frontend && pnpm dev"
echo "   3. Login with:"
echo "      • Admin: admin@hotel.com / admin123"
echo "      • Visitor: customer@hotel.com / customer123"
echo ""
