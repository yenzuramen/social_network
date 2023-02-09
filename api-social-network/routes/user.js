const express = require("express")
const router = express.Router()

const userController = require("../controllers/user")

//Defining routes
router.get("/test-user", userController.testUser)

//Export Router
module.exports = router