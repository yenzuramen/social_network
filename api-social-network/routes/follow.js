const express = require("express")
const router = express.Router()

const followController = require("../controllers/follow")

//Defining routes
router.get("/test-follow", followController.testFollow)

//Export Router
module.exports = router