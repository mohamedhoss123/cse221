require('dotenv').config();
const { query } = require('./src/database/connection');

async function seedTestData() {
  try {
    console.log('Starting database seed...');

    // Check if user exists
    const users = await query('SELECT * FROM USER WHERE email = ? LIMIT 1', ['customer@test.com']);

    let userId;
    if (users.length === 0) {
      // Create test user
      console.log('Creating test user...');
      const result = await query(
        'INSERT INTO USER (email, password, name, role) VALUES (?, ?, ?, ?)',
        ['customer@test.com', 'hashed_password', 'Test Customer', 'visitor']
      );
      userId = result.insertId;
      console.log('Created user with ID:', userId);
    } else {
      userId = users[0].user_id;
      console.log('Using existing user ID:', userId);
    }

    // Get or create visitor
    const visitors = await query('SELECT visitor_id FROM VISITOR WHERE USER_user_id = ?', [userId]);
    let visitorId;
    if (visitors.length === 0) {
      const result = await query(
        'INSERT INTO VISITOR (USER_user_id) VALUES (?)',
        [userId]
      );
      visitorId = result.insertId;
      console.log('Created visitor with ID:', visitorId);
    } else {
      visitorId = visitors[0].visitor_id;
      console.log('Using existing visitor ID:', visitorId);
    }

    // Check if room exists
    const rooms = await query('SELECT * FROM ROOM LIMIT 1');
    if (rooms.length === 0) {
      // Create test room
      console.log('Creating test room...');
      await query(
        'INSERT INTO ROOM (price, type) VALUES (?, ?)',
        [150, 'deluxe']
      );
      const newRooms = await query('SELECT * FROM ROOM LIMIT 1');
      console.log('Created room:', newRooms[0]);
    }

    // Get room
    const room = await query('SELECT * FROM ROOM LIMIT 1');
    const roomId = room[0].room_id;
    console.log('Using room ID:', roomId);

    // Create a reservation
    const checkIn = new Date();
    const checkOut = new Date();
    checkOut.setDate(checkOut.getDate() + 5);

    const existingRes = await query(
      'SELECT * FROM RESERVATION WHERE ROOM_room_id = ? AND VISITOR_visitor_id = ?',
      [roomId, visitorId]
    );

    let reservationId;
    if (existingRes.length === 0) {
      console.log('Creating test reservation...');
      const resResult = await query(
        'INSERT INTO RESERVATION (start_date, end_date, ROOM_room_id, VISITOR_visitor_id) VALUES (?, ?, ?, ?)',
        [checkIn.toISOString().split('T')[0], checkOut.toISOString().split('T')[0], roomId, visitorId]
      );
      reservationId = resResult.insertId;
      console.log('Created reservation with ID:', reservationId);
    } else {
      reservationId = existingRes[0].reservvaion_id;
      console.log('Using existing reservation ID:', reservationId);
    }

    // Create an invoice
    const existingInv = await query(
      'SELECT * FROM INVOICE WHERE RESERVATION_reservvaion_id = ?',
      [reservationId]
    );

    if (existingInv.length === 0) {
      console.log('Creating test invoice...');
      const amount = 150 * 5; // 5 nights at $150
      const today = new Date().toISOString().split('T')[0];

      const invResult = await query(
        'INSERT INTO INVOICE (amount, date, VISITOR_visitor_id, ROOM_room_id, RESERVATION_reservvaion_id) VALUES (?, ?, ?, ?, ?)',
        [amount, today, visitorId, roomId, reservationId]
      );
      const invoiceId = invResult.insertId;
      console.log('Created invoice with ID:', invoiceId);
      console.log('\\n✅ Test data created successfully!');
      console.log('\\nYou can now access the invoice at: http://localhost:3000/customer/payments/' + invoiceId);
    } else {
      console.log('Invoice already exists with ID:', existingInv[0].invoce_id);
      console.log('\\nYou can access the invoice at: http://localhost:3000/customer/payments/' + existingInv[0].invoce_id);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
}

seedTestData();
