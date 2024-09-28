const express = require("express")
const router = express.Router()
const userController = require("../controllers/users")
const { authUser, authorizeRole } = require("../middleware/auth")

router.post("/", userController.createUser)
router.post("/login", userController.loginUser)
router.get("/", authUser, authorizeRole('admin'), userController.listUsers)


module.exports = router