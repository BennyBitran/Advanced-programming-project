const express = require("express");

const searchController = require("../controllers/search.js");
const { verifyToken } = require("../middleware/auth.js");
const router = express.Router();

router.get("/:query", verifyToken, searchController.search);

module.exports = router;