const errorHandler = (err, req, res, next) => {

  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.setHeader("Content-Type", "application/json");
  res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred, please try again later"
        : err.message,
  });
};

// Handling non-existent routes
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route Not Found: ${req.originalUrl}`);
  error.code = 404;
  next(error);
};

module.exports = { errorHandler, notFoundHandler };
