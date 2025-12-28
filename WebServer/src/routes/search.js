const express = require("express");

const searchController = require("../controllers/search.js");
const router = express.Router();

router.get("/:query", searchController.search);

module.exports = router;