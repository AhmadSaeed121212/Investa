const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const registerValidator = (req) => {
  const { name, email, phone, password, confirmPassword, role } = req.body;
  const errors = [];
  if (!name || name.trim().length < 2) errors.push("Name is required");
  if (!email || !emailRegex.test(email)) errors.push("Valid email is required");
  if (!phone || phone.trim().length < 6) errors.push("Valid phone is required");
  if (!password || password.length < 6) errors.push("Password min length is 6");
  if (password !== confirmPassword) errors.push("Passwords do not match");
  if (role && !["user", "admin"].includes(role)) errors.push("Invalid role");
  return errors;
};

const loginValidator = (req) => {
  const { email, password } = req.body;
  const errors = [];
  if (!email || !emailRegex.test(email)) errors.push("Valid email is required");
  if (!password) errors.push("Password is required");
  return errors;
};

module.exports = { registerValidator, loginValidator };
