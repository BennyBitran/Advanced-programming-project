const express = require("express");

const userController = require("../controllers/users.js");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

router.post ("/", userController.createUser);
router.get ("/", verifyToken, userController.getUserId);
router.get ("/:id", verifyToken, userController.getUserById);
router.patch("/:id", verifyToken, userController.patchUserImage);
module.exports = router;