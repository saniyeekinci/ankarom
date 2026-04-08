/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 Not Found handler
 */
export const notFound = (req, res, next) => {
  const error = new ApiError(404, `Bulunamadı: ${req.originalUrl}`);
  next(error);
};

/**
 * Global error handler
 */
export const errorHandler = (err, req, res, _next) => {
  // Log error for debugging (in production, send to logging service)
  console.error(`[ERROR] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.error(`Message: ${err.message}`);
  if (process.env.NODE_ENV !== "production") {
    console.error(`Stack: ${err.stack}`);
  }

  // Determine status code
  let statusCode = err.statusCode || res.statusCode;
  if (statusCode === 200) statusCode = 500;

  // Handle specific error types
  let message = err.message || "Sunucu hatası";

  // MongoDB duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    message = "Bu kayıt zaten mevcut.";
  }

  // MongoDB validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages.join(", ");
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Geçersiz token.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token süresi dolmuş.";
  }

  // MongoDB CastError (invalid ObjectId)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message = "Geçersiz ID formatı.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};