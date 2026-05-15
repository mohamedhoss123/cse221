/**
 * Database Seeding Script
 * Seeds initial users (admin and visitor) based on frontend mock data
 * Run with: npm run seed
 */

const bcrypt = require('bcryptjs');
const { query } = require('./src/database/connection');

// Mock data from frontend converted to backend seed data
const seedData = {
  users: [
    {
      name: 'Admin User',
      email: 'admin@hotel.com',
      phone: '+1-800-HOTEL-01',
      password: 'admin123',
      role: 'admin',
    },
    {
      name: 'John Customer',
      email: 'customer@hotel.com',
      phone: '+1-800-CUSTOMER-01',
      password: 'customer123',
      role: 'visitor',
    },
    {
      name: 'Jane Doe',
      email: 'jane@hotel.com',
      phone: '+1-800-JANE-01',
      password: 'jane123',
      role: 'visitor',
    },
    {
      name: 'Bob Smith',
      email: 'bob@hotel.com',
      phone: '+1-800-BOB-01',
      password: 'bob123',
      role: 'visitor',
    },
  ],
  visitors: [
    {
      userEmail: 'customer@hotel.com',
      address: '123 Main St, New York, NY 10001',
      gender: 'Male',
      birthdate: '1990-05-15',
    },
    {
      userEmail: 'jane@hotel.com',
      address: '456 Oak Ave, Los Angeles, CA 90001',
      gender: 'Female',
      birthdate: '1992-08-22',
    },
    {
      userEmail: 'bob@hotel.com',
      address: '789 Pine Rd, Chicago, IL 60601',
      gender: 'Male',
      birthdate: '1988-03-10',
    },
  ],
};

/**
 * Hash password using bcryptjs
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Seed users into the database
 */
async function seedUsers() {
  console.log('🌱 Seeding users...');
  try {
    for (const user of seedData.users) {
      const hashedPassword = await hashPassword(user.password);

      await query(
        `INSERT INTO USER (name, email, phone, password, role) 
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         name = VALUES(name), phone = VALUES(phone)`,
        [user.name, user.email, user.phone, hashedPassword, user.role]
      );

      console.log(`✓ User created/updated: ${user.email} (${user.role})`);
    }
    console.log('✓ All users seeded successfully!\n');
  } catch (error) {
    console.error('✗ Error seeding users:', error.message);
    throw error;
  }
}

/**
 * Seed visitor data into the database
 */
async function seedVisitors() {
  console.log('🌱 Seeding visitor profiles...');
  try {
    for (const visitor of seedData.visitors) {
      // Get user_id from email
      const [userResult] = await query(
        'SELECT user_id FROM USER WHERE email = ?',
        [visitor.userEmail]
      );

      if (!userResult || !userResult[0]) {
        console.warn(`⚠ User not found for email: ${visitor.userEmail}`);
        continue;
      }

      const userId = userResult[0].user_id;

      await query(
        `INSERT INTO VISITOR (address, gender, birthdate, user_id) 
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         address = VALUES(address), gender = VALUES(gender), birthdate = VALUES(birthdate)`,
        [visitor.address, visitor.gender, visitor.birthdate, userId]
      );

      console.log(`✓ Visitor profile created/updated for: ${visitor.userEmail}`);
    }
    console.log('✓ All visitor profiles seeded successfully!\n');
  } catch (error) {
    console.error('✗ Error seeding visitors:', error.message);
    throw error;
  }
}

/**
 * Verify seeding results
 */
async function verifySeed() {
  console.log('📋 Verification Report:');
  console.log('='.repeat(50));
  try {
    // Count users by role
    const [userCounts] = await query(
      'SELECT role, COUNT(*) as count FROM USER GROUP BY role'
    );

    console.log('\nUser Counts by Role:');
    userCounts.forEach((row) => {
      console.log(`  • ${row.role}: ${row.count}`);
    });

    // List all users
    const [allUsers] = await query('SELECT user_id, name, email, role FROM USER');
    console.log('\nAll Users:');
    allUsers.forEach((user) => {
      console.log(
        `  • [${user.user_id}] ${user.name} (${user.email}) - ${user.role}`
      );
    });

    // Count visitors
    const [visitorCount] = await query(
      'SELECT COUNT(*) as count FROM VISITOR'
    );
    console.log(`\nVisitor Profiles: ${visitorCount[0].count}`);

    // List all visitors
    const [allVisitors] = await query(
      `SELECT v.visitor_id, u.name, u.email, v.address, v.gender, v.birthdate 
       FROM VISITOR v 
       JOIN USER u ON v.user_id = u.user_id`
    );

    console.log('\nVisitor Details:');
    allVisitors.forEach((visitor) => {
      console.log(
        `  • [${visitor.visitor_id}] ${visitor.name} (${visitor.email})`
      );
      console.log(`    Address: ${visitor.address}`);
      console.log(`    Gender: ${visitor.gender}, Birthdate: ${visitor.birthdate}`);
    });

    console.log('\n' + '='.repeat(50));
    console.log('✓ Seeding verification completed successfully!\n');
  } catch (error) {
    console.error('✗ Error during verification:', error.message);
    throw error;
  }
}

/**
 * Main seed function
 */
async function runSeed() {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║    Hotel Management Database Seeding       ║');
  console.log('╚════════════════════════════════════════════╝\n');

  try {
    // Seed users
    await seedUsers();

    // Seed visitor profiles
    await seedVisitors();

    // Verify seeding
    await verifySeed();

    console.log('🎉 Database seeding completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error('\nMake sure:');
    console.error('  1. Database is running');
    console.error('  2. Schema is initialized (backend/schema.sql)');
    console.error('  3. Database credentials in .env are correct');
    process.exit(1);
  }
}

// Run seeding
runSeed();
