module.exports = function errorHandler(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);
  const code = err.statusCode || 500;
  const msg = err.message || 'Internal Server Error';
  res.status(code).json({ status: false, message: msg });
};
