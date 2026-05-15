const { query } = require('../../database/connection');
const { createError } = require('../../utils/helpers');

class RoomImageService {
  async getRoomImages(roomId) {
    const images = await query(
      'SELECT * FROM ROOM_IMAGES WHERE room_id = ? ORDER BY display_order',
      [roomId]
    );

    return images.map(img => ({
      id: img.image_id.toString(),
      url: img.image_url,
      caption: img.caption,
      isPrimary: img.is_primary === 1,
      displayOrder: img.display_order
    }));
  }

  async addImage(roomId, imageData) {
    const { url, caption, isPrimary } = imageData;

    if (!url) {
      throw createError('Image URL is required', 400);
    }

    // Get next display order
    const orderResult = await query(
      'SELECT COALESCE(MAX(display_order), -1) + 1 as next_order FROM ROOM_IMAGES WHERE room_id = ?',
      [roomId]
    );

    // If primary, unset others
    if (isPrimary) {
      await query('UPDATE ROOM_IMAGES SET is_primary = FALSE WHERE room_id = ?', [roomId]);
    }

    const result = await query(
      'INSERT INTO ROOM_IMAGES (room_id, image_url, caption, is_primary, display_order) VALUES (?, ?, ?, ?, ?)',
      [roomId, url, caption || null, isPrimary ? 1 : 0, orderResult[0].next_order]
    );

    const images = await query(
      'SELECT * FROM ROOM_IMAGES WHERE image_id = ?',
      [result.insertId]
    );

    const img = images[0];
    return {
      id: img.image_id.toString(),
      url: img.image_url,
      caption: img.caption,
      isPrimary: img.is_primary === 1,
      displayOrder: img.display_order
    };
  }

  async deleteImage(imageId) {
    await query('DELETE FROM ROOM_IMAGES WHERE image_id = ?', [imageId]);
    return { message: 'Image deleted successfully', imageId };
  }

  async setAsPrimary(imageId) {
    const img = await query('SELECT room_id FROM ROOM_IMAGES WHERE image_id = ?', [imageId]);

    if (img.length === 0) {
      throw createError('Image not found', 404);
    }

    const roomId = img[0].room_id;

    // Unset others
    await query('UPDATE ROOM_IMAGES SET is_primary = FALSE WHERE room_id = ?', [roomId]);

    // Set this one as primary
    await query('UPDATE ROOM_IMAGES SET is_primary = TRUE WHERE image_id = ?', [imageId]);

    const images = await query('SELECT * FROM ROOM_IMAGES WHERE image_id = ?', [imageId]);
    const img2 = images[0];

    return {
      id: img2.image_id.toString(),
      url: img2.image_url,
      caption: img2.caption,
      isPrimary: img2.is_primary === 1,
      displayOrder: img2.display_order
    };
  }
}

module.exports = new RoomImageService();
