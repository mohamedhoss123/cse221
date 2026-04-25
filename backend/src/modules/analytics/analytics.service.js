const { query } = require('../../database/connection');

class AnalyticsService {
  // Get overall statistics (for top cards)
  async getOverallStats() {
    const stats = await query(`
      SELECT
        COUNT(DISTINCT r.reservation_id) as totalBookings,
        SUM(CASE WHEN r.status = 'confirmed' THEN 1 ELSE 0 END) as confirmedBookings,
        SUM(i.amount) as totalRevenue,
        SUM(r.guests) as totalGuests
      FROM RESERVATION r
      LEFT JOIN INVOICE i ON r.reservation_id = i.RESERVATION_reservation_id
      WHERE r.status != 'cancelled'
    `);

    return {
      totalBookings: stats[0].totalBookings || 0,
      confirmedBookings: stats[0].confirmedBookings || 0,
      totalRevenue: stats[0].totalRevenue || 0,
      totalGuests: stats[0].totalGuests || 0,
      completionRate: stats[0].totalBookings > 0
        ? ((stats[0].confirmedBookings / stats[0].totalBookings) * 100).toFixed(1)
        : 0,
      avgGuestsPerBooking: stats[0].totalBookings > 0
        ? (stats[0].totalGuests / stats[0].totalBookings).toFixed(1)
        : 0
    };
  }

  // Get monthly revenue and booking trends
  async getMonthlyTrends(months = 6) {
    const trends = await query(`
      SELECT
        DATE_FORMAT(r.start_date, '%Y-%m') as month,
        DATE_FORMAT(r.start_date, '%b') as monthName,
        COUNT(r.reservation_id) as bookings,
        COALESCE(SUM(i.amount), 0) as revenue
      FROM RESERVATION r
      LEFT JOIN INVOICE i ON r.reservation_id = i.RESERVATION_reservation_id
      WHERE r.start_date >= DATE_SUB(CURDATE(), INTERVAL ${months} MONTH)
        AND r.status != 'cancelled'
      GROUP BY DATE_FORMAT(r.start_date, '%Y-%m'), DATE_FORMAT(r.start_date, '%b')
      ORDER BY month ASC
    `);

    // If no data, return empty array
    if (!trends || trends.length === 0) {
      return [];
    }

    return trends.map(t => ({
      month: t.monthName,
      revenue: parseFloat(t.revenue) || 0,
      bookings: t.bookings
    }));
  }

  // Get booking status distribution
  async getBookingStatusDistribution() {
    const distribution = await query(`
      SELECT
        status,
        COUNT(*) as count
      FROM RESERVATION
      GROUP BY status
    `);

    return distribution.map(d => ({
      name: d.status.charAt(0).toUpperCase() + d.status.slice(1),
      value: d.count
    }));
  }

  // Get most booked rooms
  async getMostBookedRooms(limit = 5) {
    const rooms = await query(`
      SELECT
        ro.room_id,
        ro.name,
        COUNT(r.reservation_id) as bookings
      FROM ROOM ro
      LEFT JOIN RESERVATION r ON ro.room_id = r.ROOM_room_id
        AND (r.status IS NULL OR r.status != 'cancelled')
      GROUP BY ro.room_id, ro.name
      ORDER BY bookings DESC
      LIMIT ${limit}
    `);

    return rooms.map(r => ({
      id: r.room_id.toString(),
      name: r.name || `Room ${r.room_id}`,
      bookings: r.bookings
    }));
  }

  // Get room type distribution
  async getRoomTypeDistribution() {
    const types = await query(`
      SELECT
        type,
        COUNT(*) as count
      FROM ROOM
      GROUP BY type
    `);

    return types.map(t => ({
      name: t.type,
      value: t.count
    }));
  }

  // Get complete analytics data (for single API call)
  async getCompleteAnalytics() {
    const [stats, trends, statusDist, topRooms, roomTypes] = await Promise.all([
      this.getOverallStats(),
      this.getMonthlyTrends(6),
      this.getBookingStatusDistribution(),
      this.getMostBookedRooms(5),
      this.getRoomTypeDistribution()
    ]);

    return {
      stats,
      trends,
      statusDistribution: statusDist,
      topRooms,
      roomTypes
    };
  }
}

module.exports = new AnalyticsService();
