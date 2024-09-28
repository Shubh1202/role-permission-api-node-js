const express = require('express')
const router = express.Router()
const { authUser, authorizeRole } = require("../middleware/auth")
const permissionController = require("../controllers/permissions")

router.post("/", authUser, authorizeRole('admin'), permissionController.createPermission)
router.get("/", authUser, authorizeRole('admin'), permissionController.getPermission)
router.delete("/:id", authUser, authorizeRole('admin'), permissionController.deletePermission)
router.put("/:id", authUser, authorizeRole('admin'), permissionController.updatePermission)
module.exports = router