const express = require("express")
const router = express.Router()

const userController = require("../controllers/user")

//Defining routes
router.get("/test-user", userController.testUser)
router.post("/save-user", userController.saveUser)
router.post("/log-in", userController.login)
//Export Router
module.exports = router