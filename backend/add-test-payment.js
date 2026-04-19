require('dotenv').config();
const { query } = require('./src/database/connection');

async function addTestPayment() {
  try {
    // Get the most recent invoice
    const invoices = await query('SELECT * FROM INVOICE ORDER BY invoce_id DESC LIMIT 1');

    if (invoices.length === 0) {
      console.log('No invoices found. Please run seed-test-data.js first.');
      process.exit(1);
    }

    const invoice = invoices[0];
    console.log('Found invoice:', invoice.invoce_id);

    // Add a partial payment
    const paymentAmount = parseFloat(invoice.amount) * 0.5; // 50% payment
    const today = new Date().toISOString().split('T')[0];

    const result = await query(
      'INSERT INTO PAYMENT (type, amount, date, INVOICE_invoce_id) VALUES (?, ?, ?, ?)',
      ['credit_card', paymentAmount, today, invoice.invoce_id]
    );

    console.log('✅ Created payment with ID:', result.insertId);
    console.log('   Amount: $' + paymentAmount);
    console.log('   Invoice ID:', invoice.invoce_id);
    console.log('\\nNow you can view the invoice with payment history at:');
    console.log('http://localhost:3000/customer/payments/' + invoice.invoce_id);

    process.exit(0);
  } catch (error) {
    console.error('Error adding payment:', error.message);
    process.exit(1);
  }
}

addTestPayment();
