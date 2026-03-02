const { fail } = require("../utils/apiResponse");

const notFound = (req, res) => fail(res, 404, `Route ${req.originalUrl} not found`, { path: req.originalUrl });

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  if (statusCode >= 500) {
    console.error("[ERROR]", err);
  }

  return fail(res, statusCode, message, err.errors || null);
};

module.exports = { notFound, errorHandler };
