const express = require("express");
const router = express.Router();
const { saveTestResults, getTestsByUser } = require("../controllers/testController");

// POST /api/tests => create or update test
router.post("/", saveTestResults);
router.get("/", getTestsByUser);

module.exports = router;
