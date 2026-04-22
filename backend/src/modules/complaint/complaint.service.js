const { query } = require('../../database/connection');
const { createError } = require('../../utils/helpers');

class ComplaintService {
  async getAllComplaints(visitorId = null) {
    let sql = 'SELECT * FROM COMPLAINTS';
    const params = [];

    if (visitorId) {
      sql += ' WHERE VISITOR_visitor_id = ?';
      params.push(visitorId);
    }

    sql += ' ORDER BY complaint_id DESC';

    const complaints = await query(sql, params);

    return complaints.map(c => ({
      id: c.complaint_id.toString(),
      description: c.description,
      type: c.type,
      status: c.Status,
      visitorId: c.VISITOR_visitor_id.toString()
    }));
  }

  async getComplaintById(complaintId) {
    const complaints = await query(
      'SELECT * FROM COMPLAINTS WHERE complaint_id = ?',
      [complaintId]
    );

    if (complaints.length === 0) {
      throw createError('Complaint not found', 404);
    }

    const c = complaints[0];
    return {
      id: c.complaint_id.toString(),
      description: c.description,
      type: c.type,
      status: c.Status,
      visitorId: c.VISITOR_visitor_id.toString()
    };
  }

  async createComplaint(complaintData) {
    const { description, type, visitorId } = complaintData;

    if (!description || !type) {
      throw createError('Description and type are required', 400);
    }

    const result = await query(
      'INSERT INTO COMPLAINTS (description, type, VISITOR_visitor_id) VALUES (?, ?, ?)',
      [description, type, visitorId]
    );

    return await this.getComplaintById(result.insertId);
  }

  async updateComplaint(complaintId, updates) {
    const existing = await query(
      'SELECT complaint_id FROM COMPLAINTS WHERE complaint_id = ?',
      [complaintId]
    );

    if (existing.length === 0) {
      throw createError('Complaint not found', 404);
    }

    // Only allow status updates - ignore other fields
    const { status } = updates;

    if (status === undefined) {
      // No status provided, just return existing complaint
      return await this.getComplaintById(complaintId);
    }

    // Validate status is a valid enum value
    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      throw createError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }

    await query(
      'UPDATE COMPLAINTS SET Status = ? WHERE complaint_id = ?',
      [status, complaintId]
    );

    return await this.getComplaintById(complaintId);
  }

  async deleteComplaint(complaintId) {
    await query('DELETE FROM COMPLAINTS WHERE complaint_id = ?', [complaintId]);
    return { message: 'Complaint deleted successfully', complaintId };
  }

  async getStatistics() {
    const stats = await query(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN Status = 'open' THEN 1 ELSE 0 END) as open,
        SUM(CASE WHEN Status = 'in_progress' THEN 1 ELSE 0 END) as inProgress,
        SUM(CASE WHEN Status = 'resolved' THEN 1 ELSE 0 END) as resolved
      FROM COMPLAINTS
    `);

    return {
      total: stats[0].total,
      open: stats[0].open || 0,
      inProgress: stats[0].inProgress || 0,
      resolved: stats[0].resolved || 0
    };
  }
}

module.exports = new ComplaintService();
