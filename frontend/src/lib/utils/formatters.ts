/**
 * Shared formatting utilities for frontend
 * Eliminates code duplication across components
 */

/**
 * Format price to currency string
 * @param price - Price in dollars
 * @returns Formatted price string (e.g., "$100.00")
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * Format room type to title case
 * @param type - Room type (e.g., "deluxe", "standard")
 * @returns Formatted room title (e.g., "Deluxe Room")
 */
export function formatRoomTitle(type: string): string {
  if (!type) return 'Room';
  return `${type.charAt(0).toUpperCase() + type.slice(1)} Room`;
}

/**
 * Format date to readable string
 * @param date - Date string or Date object
 * @param format - Format type (default: 'MMM d, yyyy')
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date,
  format: 'short' | 'medium' | 'long' | 'MMM d, yyyy' = 'MMM d, yyyy'
): string {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';

  const options: Intl.DateTimeFormatOptions = {
    short: { month: 'numeric', day: 'numeric', year: 'numeric' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
    'MMM d, yyyy': { month: 'short', day: 'numeric', year: 'numeric' }
  }[format] || { month: 'short', day: 'numeric', year: 'numeric' };

  return dateObj.toLocaleDateString('en-US', options);
}

/**
 * Calculate number of nights between two dates
 * @param checkIn - Check-in date
 * @param checkOut - Check-out date
 * @returns Number of nights
 */
export function calculateNights(checkIn: Date | string, checkOut: Date | string): number {
  const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;
  const checkOutDate = typeof checkOut === 'string' ? new Date(checkOut) : checkOut;
  return Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 * @param date - Date string or Date object
 * @returns ISO date string or empty string if invalid
 */
export function toISODate(date: string | Date): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  return dateObj.toISOString().split('T')[0];
}

/**
 * Calculate due date from invoice date
 * @param invoiceDate - Invoice date
 * @param days - Number of days until due (default: 30)
 * @returns Due date string
 */
export function calculateDueDate(invoiceDate: string | Date, days: number = 30): string {
  const date = typeof invoiceDate === 'string' ? new Date(invoiceDate) : invoiceDate;
  if (isNaN(date.getTime())) return '';
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Format status to display-friendly text
 * @param status - Status string
 * @returns Formatted status with capital first letter
 */
export function formatStatus(status: string): string {
  if (!status) return '';
  return status.charAt(0).toUpperCase() + status.slice(1);
}
