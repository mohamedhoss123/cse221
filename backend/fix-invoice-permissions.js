require('dotenv').config();
const { query } = require('./src/database/connection');

async function showCurrentUserAndCreateInvoice() {
  try {
    console.log('Checking current users and their invoices...\n');

    // Get all users with their visitor IDs
    const users = await query(`
      SELECT u.user_id, u.email, u.name, v.visitor_id
      FROM USER u
      LEFT JOIN VISITOR v ON v.USER_user_id = u.user_id
      WHERE u.role = 'visitor'
    `);

    console.log('Current visitor users:');
    users.forEach(u => {
      console.log(`  User ID: ${u.user_id}`);
      console.log(`  Email: ${u.email}`);
      console.log(`  Name: ${u.name}`);
      console.log(`  Visitor ID: ${u.visitor_id || 'None'}`);
      console.log('');
    });

    // Get all invoices with their customer IDs
    const invoices = await query(`
      SELECT i.invoce_id, i.VISITOR_visitor_id, v.USER_user_id as customer_id
      FROM INVOICE i
      JOIN VISITOR v ON i.VISITOR_visitor_id = v.visitor_id
    `);

    console.log('Current invoices:');
    invoices.forEach(inv => {
      const user = users.find(u => u.user_id === inv.customer_id);
      console.log(`  Invoice #${inv.invoce_id} → Belongs to User ID: ${inv.customer_id} (${user?.email || 'Unknown'})`);
    });

    console.log('\n--- SOLUTION ---\n');
    console.log('The invoice you\'re trying to access doesn\'t belong to your logged-in user.');
    console.log('\nPlease tell me:');
    console.log('1. What email are you currently logged in with? (Check browser DevTools → Application → Local Storage → auth_user)');
    console.log('2. Or I can create a new invoice for each user right now...\n');

    // Create invoices for any users that don't have one
    const today = new Date();
    const checkIn = new Date(today);
    const checkOut = new Date(today);
    checkOut.setDate(checkOut.getDate() + 2);

    const room = await query('SELECT * FROM ROOM LIMIT 1');
    if (room.length === 0) {
      await query('INSERT INTO ROOM (price, type) VALUES (?, ?)', [150, 'deluxe']);
      const newRoom = await query('SELECT * FROM ROOM LIMIT 1');
      room[0] = newRoom[0];
    }

    for (const user of users) {
      // Check if this user already has an invoice
      const hasInvoice = invoices.some(inv => inv.customer_id === user.user_id);

      if (hasInvoice) {
        console.log(`✓ User ${user.email} (ID: ${user.user_id}) already has an invoice`);
        continue;
      }

      // Create visitor if needed
      let visitorId = user.visitor_id;
      if (!visitorId) {
        const visResult = await query('INSERT INTO VISITOR (USER_user_id) VALUES (?)', [user.user_id]);
        visitorId = visResult.insertId;
      }

      // Create reservation
      const resResult = await query(
        'INSERT INTO RESERVATION (start_date, end_date, ROOM_room_id, VISITOR_visitor_id) VALUES (?, ?, ?, ?)',
        [checkIn.toISOString().split('T')[0], checkOut.toISOString().split('T')[0], room[0].room_id, visitorId]
      );

      // Create invoice
      const amount = parseFloat(room[0].price) * 2;
      const invResult = await query(
        'INSERT INTO INVOICE (amount, date, VISITOR_visitor_id, ROOM_room_id, RESERVATION_reservvaion_id) VALUES (?, ?, ?, ?, ?)',
        [amount, today.toISOString().split('T')[0], visitorId, room[0].room_id, resResult.insertId]
      );

      // Add a partial payment
      await query(
        'INSERT INTO PAYMENT (type, amount, date, INVOICE_invoce_id) VALUES (?, ?, ?, ?)',
        ['credit_card', amount * 0.5, today.toISOString().split('T')[0], invResult.insertId]
      );

      console.log(`✓ Created invoice #${invResult.insertId} for user ${user.email} (ID: ${user.user_id})`);
      console.log(`  Access at: http://localhost:3000/customer/payments/${invResult.insertId}`);
    }

    console.log('\n✅ Done! Now log in with the corresponding email and access the invoice.\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

showCurrentUserAndCreateInvoice();
