const express = require("express");
const tokensController = require("../controllers/tokens");

const router = express.Router();

router.post("/", tokensController.createToken);

module.exports = router;