const { query } = require('../../../database/connection');

class RoomService {
  async getAllRooms(filters = {}) {
    let sql = 'SELECT * FROM ROOM';
    const params = [];

    if (filters.type) {
      sql += ' WHERE type = ?';
      params.push(filters.type);
    }

    if (filters.minPrice !== undefined) {
      const operator = sql.includes('WHERE') ? ' AND' : ' WHERE';
      sql += `${operator} price >= ?`;
      params.push(filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      const operator = sql.includes('WHERE') ? ' AND' : ' WHERE';
      sql += `${operator} price <= ?`;
      params.push(filters.maxPrice);
    }

    if (filters.capacity !== undefined) {
      const operator = sql.includes('WHERE') ? ' AND' : ' WHERE';
      sql += `${operator} price >= ?`;
      params.push(filters.capacity);
    }

    if (filters.available !== undefined) {
      const operator = sql.includes('WHERE') ? ' AND' : ' WHERE';
      sql += `${operator} type = ?`;
      params.push(filters.available ? 'available' : 'unavailable');
    }

    const rooms = await query(sql, params);

    return rooms.map(room => ({
      room_id: room.room_id.toString(),
      type: room.type,
      price: room.price,
      description: room.type
    }));
  }

  async getRoomById(roomId) {
    const rooms = await query(
      'SELECT * FROM ROOM WHERE room_id = ?',
      [roomId]
    );

    if (rooms.length === 0) {
      const error = new Error('Room not found');
      error.statusCode = 404;
      throw error;
    }

    const room = rooms[0];
    return {
      room_id: room.room_id.toString(),
      type: room.type,
      price: room.price,
      description: room.type
    };
  }

  async createRoom(roomData) {
    const { type, price, description } = roomData;

    const result = await query(
      'INSERT INTO ROOM (type, price) VALUES (?, ?)',
      [type, price]
    );

    const rooms = await query(
      'SELECT * FROM ROOM WHERE room_id = ?',
      [result.insertId]
    );

    const room = rooms[0];
    return {
      room_id: room.room_id.toString(),
      type: room.type,
      price: room.price,
      description: room.type
    };
  }

  async updateRoom(roomId, roomData) {
    const existingRoom = await query(
      'SELECT room_id FROM ROOM WHERE room_id = ?',
      [roomId]
    );

    if (existingRoom.length === 0) {
      const error = new Error('Room not found');
      error.statusCode = 404;
      throw error;
    }

    const { type, price, description } = roomData;
    const updates = [];
    const values = [];

    if (type !== undefined) {
      updates.push('type = ?');
      values.push(type);
    }

    if (price !== undefined) {
      updates.push('price = ?');
      values.push(price);
    }

    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }

    if (updates.length === 0) {
      return await this.getRoomById(roomId);
    }

    values.push(roomId);

    await query(
      `UPDATE ROOM SET ${updates.join(', ')} WHERE room_id = ?`,
      values
    );

    return await this.getRoomById(roomId);
  }

  async deleteRoom(roomId) {
    const existingRoom = await query(
      'SELECT room_id FROM ROOM WHERE room_id = ?',
      [roomId]
    );

    if (existingRoom.length === 0) {
      const error = new Error('Room not found');
      error.statusCode = 404;
      throw error;
    }

    await query('DELETE FROM ROOM WHERE room_id = ?', [roomId]);

    return { message: 'Room deleted successfully' };
  }
}

module.exports = new RoomService();
