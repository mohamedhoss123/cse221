const roomImageService = require('./roomImage.service');

const getRoomImages = async (req, res, next) => {
  try {
    const images = await roomImageService.getRoomImages(req.params.roomId);

    res.status(200).json({
      success: true,
      data: images
    });
  } catch (error) {
    next(error);
  }
};

const addImage = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can add images'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const { caption, isPrimary } = req.body;
    const url = `/uploads/room-images/${req.file.filename}`;

    const image = await roomImageService.addImage(req.params.roomId, {
      url,
      caption,
      isPrimary: isPrimary === 'true'
    });

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: image
    });
  } catch (error) {
    next(error);
  }
};

const deleteImage = async (req, res, next) => {
  try {
    // Only admins
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete images'
      });
    }

    const result = await roomImageService.deleteImage(req.params.imageId);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

const setAsPrimary = async (req, res, next) => {
  try {
    // Only admins
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can set primary image'
      });
    }

    const image = await roomImageService.setAsPrimary(req.params.imageId);

    res.status(200).json({
      success: true,
      message: 'Image set as primary',
      data: image
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoomImages,
  addImage,
  deleteImage,
  setAsPrimary
};
