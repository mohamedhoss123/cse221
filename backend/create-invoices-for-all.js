require('dotenv').config();
const { query } = require('./src/database/connection');

async function createInvoicesForAllUsers() {
  try {
    console.log('Creating invoices for all visitor users...\n');

    // Get all visitor users
    const users = await query('SELECT user_id, email, name FROM USER WHERE role = ?', ['visitor']);

    // Get a room
    const rooms = await query('SELECT * FROM ROOM LIMIT 1');
    if (rooms.length === 0) {
      console.log('No rooms found. Creating a test room first...');
      await query('INSERT INTO ROOM (price, type) VALUES (?, ?)', [150, 'deluxe']);
      const newRooms = await query('SELECT * FROM ROOM LIMIT 1');
      rooms[0] = newRooms[0];
    }
    const room = rooms[0];

    const today = new Date();
    const checkIn = new Date(today);
    const checkOut = new Date(today);
    checkOut.setDate(checkOut.getDate() + 3);

    for (const user of users) {
      // Get or create visitor
      let visitors = await query('SELECT visitor_id FROM VISITOR WHERE USER_user_id = ?', [user.user_id]);
      let visitorId;

      if (visitors.length === 0) {
        const visitorResult = await query('INSERT INTO VISITOR (USER_user_id) VALUES (?)', [user.user_id]);
        visitorId = visitorResult.insertId;
      } else {
        visitorId = visitors[0].visitor_id;
      }

      // Check if invoice already exists for this visitor
      const existingInvoices = await query(
        'SELECT i.invoce_id FROM INVOICE i JOIN VISITOR v ON i.VISITOR_visitor_id = v.visitor_id WHERE v.USER_user_id = ?',
        [user.user_id]
      );

      if (existingInvoices.length > 0) {
        console.log(`✓ ${user.email} (ID: ${user.user_id}) - Already has invoice #${existingInvoices[0].invoce_id}`);
        continue;
      }

      // Create reservation
      const resResult = await query(
        'INSERT INTO RESERVATION (start_date, end_date, ROOM_room_id, VISITOR_visitor_id) VALUES (?, ?, ?, ?)',
        [checkIn.toISOString().split('T')[0], checkOut.toISOString().split('T')[0], room.room_id, visitorId]
      );
      const reservationId = resResult.insertId;

      // Create invoice
      const amount = parseFloat(room.price) * 3; // 3 nights
      const invResult = await query(
        'INSERT INTO INVOICE (amount, date, VISITOR_visitor_id, ROOM_room_id, RESERVATION_reservvaion_id) VALUES (?, ?, ?, ?, ?)',
        [amount, today.toISOString().split('T')[0], visitorId, room.room_id, reservationId]
      );
      const invoiceId = invResult.insertId;

      // Add a partial payment (50%)
      const paymentAmount = amount * 0.5;
      await query(
        'INSERT INTO PAYMENT (type, amount, date, INVOICE_invoce_id) VALUES (?, ?, ?, ?)',
        ['credit_card', paymentAmount, today.toISOString().split('T')[0], invoiceId]
      );

      console.log(`✓ ${user.email} (ID: ${user.user_id}) - Invoice #${invoiceId} created`);
      console.log(`  URL: http://localhost:3000/customer/payments/${invoiceId}`);
    }

    console.log('\n✅ All invoices created successfully!');
    console.log('\nYou can now access any invoice using the URLs above.');
    console.log('Make sure you\'re logged in as the corresponding user to view each invoice.');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createInvoicesForAllUsers();
