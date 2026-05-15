const { query } = require('../../database/connection');
const { createError } = require('../../utils/helpers');

class RoomService {
  async getRoomRating(roomId) {
    const result = await query(
      `SELECT 
        AVG(rating) as average_rating,
        COUNT(review_id) as total_reviews
       FROM REVIEW 
       WHERE ROOM_room_id = ?`,
      [roomId]
    );

    if (result[0].total_reviews === 0) {
      return {
        averageRating: 0,
        totalReviews: 0
      };
    }

    return {
      averageRating: parseFloat(result[0].average_rating).toFixed(1),
      totalReviews: result[0].total_reviews
    };
  }

  async getAllRooms(filters = {}) {
    let sql = 'SELECT * FROM ROOM';
    const params = [];

    // Apply filters
    const conditions = [];
    if (filters.type) {
      conditions.push('type = ?');
      params.push(filters.type);
    }
    if (filters.minPrice) {
      conditions.push('price >= ?');
      params.push(filters.minPrice);
    }
    if (filters.maxPrice) {
      conditions.push('price <= ?');
      params.push(filters.maxPrice);
    }
    if (filters.capacity) {
      conditions.push('capacity >= ?');
      params.push(filters.capacity);
    }
    if (filters.status) {
      conditions.push('status = ?');
      params.push(filters.status);
    }
    if (filters.available !== undefined) {
      conditions.push('status = ?');
      params.push(filters.available ? 'available' : 'unavailable');
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    const rooms = await query(sql, params);

    // Get images and ratings for each room
    const result = await Promise.all(rooms.map(async (room) => {
      const images = await query(
        'SELECT * FROM ROOM_IMAGES WHERE room_id = ? ORDER BY display_order',
        [room.room_id]
      );

      const rating = await this.getRoomRating(room.room_id);

      return {
        id: room.room_id.toString(),
        name: room.name,
        type: room.type,
        price: parseFloat(room.price),
        capacity: room.capacity,
        status: room.status,
        rating: {
          average: parseFloat(rating.averageRating),
          total: rating.totalReviews
        },
        images: images.map(img => ({
          id: img.image_id.toString(),
          url: img.image_url,
          caption: img.caption,
          isPrimary: img.is_primary === 1,
          displayOrder: img.display_order
        }))
      };
    }));

    return result;
  }

  async getRoomById(roomId) {
    const rooms = await query('SELECT * FROM ROOM WHERE room_id = ?', [roomId]);

    if (rooms.length === 0) {
      throw createError('Room not found', 404);
    }

    const room = rooms[0];

    // Get images
    const images = await query(
      'SELECT * FROM ROOM_IMAGES WHERE room_id = ? ORDER BY display_order',
      [roomId]
    );

    // Get rating
    const rating = await this.getRoomRating(roomId);

    return {
      id: room.room_id.toString(),
      name: room.name,
      type: room.type,
      price: parseFloat(room.price),
      capacity: room.capacity,
      status: room.status,
      rating: {
        average: parseFloat(rating.averageRating),
        total: rating.totalReviews
      },
      images: images.map(img => ({
        id: img.image_id.toString(),
        url: img.image_url,
        caption: img.caption,
        isPrimary: img.is_primary === 1,
        displayOrder: img.display_order
      }))
    };
  }

  async createRoom(roomData, files = []) {
    const { name, type, price, capacity = 2, status = 'available' } = roomData;

    const result = await query(
      'INSERT INTO ROOM (name, type, price, capacity, status) VALUES (?, ?, ?, ?, ?)',
      [name, type, price, capacity, status]
    );

    const roomId = result.insertId;

    // Handle image uploads if present
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = `/uploads/room-images/${file.filename}`;
        await query(
          'INSERT INTO ROOM_IMAGES (room_id, image_url, is_primary, display_order) VALUES (?, ?, ?, ?)',
          [roomId, url, i === 0 ? 1 : 0, i]
        );
      }
    }

    return await this.getRoomById(roomId);
  }

  async updateRoom(roomId, roomData, files = []) {
    const existing = await query('SELECT room_id FROM ROOM WHERE room_id = ?', [roomId]);

    if (existing.length === 0) {
      throw createError('Room not found', 404);
    }

    const { name, type, price, capacity, status } = roomData;
    const fields = [];
    const values = [];

    if (name !== undefined) {
      fields.push('name = ?');
      values.push(name);
    }
    if (type !== undefined) {
      fields.push('type = ?');
      values.push(type);
    }
    if (price !== undefined) {
      fields.push('price = ?');
      values.push(price);
    }
    if (capacity !== undefined) {
      fields.push('capacity = ?');
      values.push(capacity);
    }
    if (status !== undefined) {
      fields.push('status = ?');
      values.push(status);
    }

    if (fields.length > 0) {
      values.push(roomId);
      await query(`UPDATE ROOM SET ${fields.join(', ')} WHERE room_id = ?`, values);
    }

    // Handle new image uploads if present
    if (files && files.length > 0) {
      const currentImageCount = await query(
        'SELECT COUNT(*) as count FROM ROOM_IMAGES WHERE room_id = ?',
        [roomId]
      );
      const startOrder = currentImageCount[0].count;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = `/uploads/room-images/${file.filename}`;
        await query(
          'INSERT INTO ROOM_IMAGES (room_id, image_url, is_primary, display_order) VALUES (?, ?, ?, ?)',
          [roomId, url, 0, startOrder + i]
        );
      }
    }

    return await this.getRoomById(roomId);
  }

  async deleteRoom(roomId) {
    await query('DELETE FROM ROOM WHERE room_id = ?', [roomId]);
    return { message: 'Room deleted successfully', roomId };
  }
}

module.exports = new RoomService();
