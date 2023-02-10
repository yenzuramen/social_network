const express = require("express")
const router = express.Router()

const userController = require("../controllers/user")

const {auth} = require('../middlewares/auth')

//Defining routes
router.get("/test-user", auth , userController.testUser)
router.post("/save-user", userController.saveUser)
router.post("/log-in", userController.login)

router.get("/profile/:id",auth,userController.profile)
router.get("/list-users/:page?",auth,userController.listUsers)

router.put("/update",auth,userController.update)



//Export Router
module.exports = router