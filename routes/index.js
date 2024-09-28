const express = require("express")
const router = express.Router();
const userRoute = require("./users")
const permissionRoute = require("./permissions")
const roleRoute = require("./role")

router.use("/users", userRoute)
router.use("/permissions", permissionRoute)
router.use("/role", roleRoute)

module.exports = router