/**
 * Standardized API response middleware
 * Ensures consistent response format across all endpoints
 */

/**
 * Send a success response
 * @param {object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message (default: 'Success')
 * @param {number} statusCode - HTTP status code (default: 200)
 * @returns {object} Express response
 */
function successResponse(res, data, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
}

/**
 * Send an error response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 400)
 * @returns {object} Express response
 */
function errorResponse(res, message, statusCode = 400) {
  return res.status(statusCode).json({
    success: false,
    message
  });
}

module.exports = {
  successResponse,
  errorResponse
};
