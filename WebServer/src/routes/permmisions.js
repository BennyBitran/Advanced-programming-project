const express = require("express");

const permissionsController = require("../controllers/permissions");
const router = express.Router({ mergeParams: true });

router.get("/", permissionsController.listPermissions);
router.post("/", permissionsController.addPermission);
router.patch("/:permissionId", permissionsController.updatePermission);
router.delete("/:permissionId", permissionsController.removePermission);

module.exports = router;