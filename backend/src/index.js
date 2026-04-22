require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { initDatabase } = require('./database/init');
const { errorHandler, notFoundHandler } = require('./middleware/error');
const userRoutes = require('./modules/user/user.routes');
const roomRoutes = require('./modules/room/room.routes');
const roomImageRoutes = require('./modules/roomImage/roomImage.routes');
const bookingRoutes = require('./modules/booking/booking.routes');
const invoiceRoutes = require('./modules/invoice/invoice.routes');
const paymentRoutes = require('./modules/payment/payment.routes');
const complaintRoutes = require('./modules/complaint/complaint.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use('/api/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Express.js MySQL Auth API',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/room-images', roomImageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/complaints', complaintRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // await initDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`API Base URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;