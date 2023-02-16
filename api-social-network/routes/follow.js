const express = require("express")
const router = express.Router()

const followController = require("../controllers/follow")

const { auth } = require('../middlewares/auth')

//Defining routes
router.get("/test-follow", followController.testFollow)
router.post("/save-follow", auth, followController.save)
router.delete("/unfollow/:userToUnfollow", auth, followController.unfollow)
router.get('/following-list/:id?/:page?',auth,followController.followingList)
router.get('/follower-list/:id?/:page?',auth,followController.followersList)
//Export Router
module.exports = router