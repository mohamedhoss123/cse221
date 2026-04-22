const complaintService = require('./complaint.service');

const getAllComplaints = async (req, res, next) => {
  try {
    const visitorId = req.user.role === 'visitor' ? req.user.visitorId : null;
    const complaints = await complaintService.getAllComplaints(visitorId);

    res.status(200).json({
      success: true,
      data: complaints
    });
  } catch (error) {
    next(error);
  }
};

const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await complaintService.getComplaintById(req.params.id);

    // Check ownership for visitors
    if (req.user.role === 'visitor') {
      if (complaint.visitorId != req.user.visitorId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

const createComplaint = async (req, res, next) => {
  try {
    const { description, type } = req.body;

    if (!description || !type) {
      return res.status(400).json({
        success: false,
        message: 'Description and type are required'
      });
    }

    const complaint = await complaintService.createComplaint({
      description,
      type,
      visitorId: req.user.visitorId
    });

    res.status(201).json({
      success: true,
      message: 'Complaint created successfully',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

const updateComplaint = async (req, res, next) => {
  try {
    // Admin only
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update complaints'
      });
    }

    const complaint = await complaintService.updateComplaint(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

const deleteComplaint = async (req, res, next) => {
  try {
    // Admin only
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete complaints'
      });
    }

    const result = await complaintService.deleteComplaint(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

const getStatistics = async (req, res, next) => {
  try {
    // Admin only
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can view statistics'
      });
    }

    const stats = await complaintService.getStatistics();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  deleteComplaint,
  getStatistics
};
