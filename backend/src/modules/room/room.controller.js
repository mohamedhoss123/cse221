const roomService = require('./room.service');

const getAllRooms = async (req, res, next) => {
  try {
    const filters = {
      type: req.query.type,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
      capacity: req.query.capacity ? parseInt(req.query.capacity) : undefined,
      available: req.query.available ? req.query.available === 'true' : undefined
    };

    const rooms = await roomService.getAllRooms(filters);

    res.status(200).json({
      success: true,
      data: rooms
    });
  } catch (error) {
    next(error);
  }
};

const getRoomById = async (req, res, next) => {
  try {
    const room = await roomService.getRoomById(req.params.id);

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    next(error);
  }
};

const createRoom = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create rooms'
      });
    }

    const roomData = {
      name: req.body.name,
      type: req.body.type,
      price: req.body.price,
      capacity: req.body.capacity,
      status: req.body.status
    };

    const room = await roomService.createRoom(roomData, req.files || []);

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room
    });
  } catch (error) {
    next(error);
  }
};

const updateRoom = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update rooms'
      });
    }

    const room = await roomService.updateRoom(req.params.id, req.body, req.files || []);

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: room
    });
  } catch (error) {
    next(error);
  }
};

const deleteRoom = async (req, res, next) => {
  try {
    const result = await roomService.deleteRoom(req.params.id);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
};
