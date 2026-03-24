export const notFound = (req, res, next) => {
  const error = new Error(`Bulunamadı: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  void next;
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || "Sunucu hatası",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
