const express = require("express");
const router = express.Router();

const { register, login, me } = require("../controller/auth.Controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", protect, login);
router.get("/me", protect, me);

module.exports = router;