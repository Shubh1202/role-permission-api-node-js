const express = require('express')
const router = express.Router()
const { authUser, authorizeRole } = require("../middleware/auth")
const roleController = require("../controllers/roles")

router.post("/", authUser, authorizeRole('admin'), roleController.createRole)
router.get("/", authUser, authorizeRole('admin'), roleController.getRole)
// router.delete("/:id", authUser, authorizeRole('admin'), roleController.deleteRole)
// router.put("/:id", authUser, authorizeRole('admin'), roleController.updateRole)
module.exports = router