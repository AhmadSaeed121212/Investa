const express = require("express");
const router = express.Router();

const { listActivePlansPublic } = require("../controller/investmentPlan");

router.get("/", listActivePlansPublic);

module.exports = router;