const express = require("express");
const router = express.Router();
const { register, login, me } = require("../controller/auth.Controller");
const { protect } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");
const { registerValidator, loginValidator } = require("../validators/auth.validator");

router.post("/register", validate(registerValidator), register);
router.post("/login", validate(loginValidator), login);
router.get("/me", protect, me);

module.exports = router;
