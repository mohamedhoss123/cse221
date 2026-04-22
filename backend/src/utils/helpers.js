/**
 * Shared utility functions for backend services
 * Eliminates code duplication across modules
 */

/**
 * Format a date value to ISO string (YYYY-MM-DD)
 * @param {Date|string} dateValue - Date to format
 * @returns {string|null} Formatted date string or null if invalid
 */
function formatDate(dateValue) {
  if (!dateValue) return null;
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return null;
  return date.toISOString().split('T')[0];
}

/**
 * Calculate number of nights between two dates
 * @param {Date|string} checkIn - Check-in date
 * @param {Date|string} checkOut - Check-out date
 * @returns {number} Number of nights
 */
function calculateNights(checkIn, checkOut) {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  return Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
}

/**
 * Calculate invoice status based on payment amounts
 * @param {number} totalAmount - Total invoice amount
 * @param {number} paidAmount - Amount paid so far
 * @returns {string} Invoice status: 'pending', 'partial', or 'paid'
 */
function calculateInvoiceStatus(totalAmount, paidAmount) {
  if (paidAmount === 0) return 'pending';
  if (paidAmount >= totalAmount) return 'paid';
  return 'partial';
}

/**
 * Create a standardized error with status code
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 400)
 * @returns {Error} Error object with statusCode property
 */
function createError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

/**
 * Transform database row to convert numeric IDs to strings
 * This ensures consistent API responses
 * @param {Object} row - Database row object
 * @returns {Object} Transformed row with string IDs
 */
function transformId(row) {
  if (!row) return row;
  const transformed = { ...row };
  Object.keys(transformed).forEach(key => {
    // Convert any column ending in _id to string
    if (key.includes('_id') && typeof transformed[key] === 'number') {
      transformed[key] = transformed[key].toString();
    }
  });
  return transformed;
}

/**
 * Format room type to title case (e.g., 'deluxe' -> 'Deluxe Room')
 * @param {string} type - Room type
 * @returns {string} Formatted room title
 */
function formatRoomTitle(type) {
  if (!type) return 'Room';
  return `${type.charAt(0).toUpperCase() + type.slice(1)} Room`;
}

/**
 * Calculate due date from invoice date
 * @param {Date|string} invoiceDate - Invoice date
 * @param {number} days - Number of days until due (default: 30)
 * @returns {string|null} Due date in YYYY-MM-DD format
 */
function calculateDueDate(invoiceDate, days = 30) {
  if (!invoiceDate) return null;
  const date = new Date(invoiceDate);
  if (isNaN(date.getTime())) return null;
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

module.exports = {
  formatDate,
  calculateNights,
  calculateInvoiceStatus,
  createError,
  transformId,
  formatRoomTitle,
  calculateDueDate
};
