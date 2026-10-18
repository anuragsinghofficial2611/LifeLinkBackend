/**
 * Wraps async route handlers to catch exceptions and forward them to Express error middleware.
 *
 * @param {Function} requestHandler
 * @returns {Function} Express middleware handler
 */
export const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
