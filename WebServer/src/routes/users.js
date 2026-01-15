const express = require("express");

const userController = require("../controllers/users.js");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

router.post ("/", userController.createUser);
router.get ("/:id", verifyToken, userController.getUserById);
module.exports = router;