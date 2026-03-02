const { fail } = require("../utils/apiResponse");

const validate = (validator) => (req, res, next) => {
  const errors = validator(req);
  if (errors.length) return fail(res, 400, "Validation error", errors);
  return next();
};

module.exports = { validate };
