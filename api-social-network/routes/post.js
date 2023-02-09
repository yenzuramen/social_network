const express = require("express")
const router = express.Router()

const postController = require("../controllers/post")

//Defining routes
router.get("/test-post", postController.testPost)

//Export Router
module.exports = router