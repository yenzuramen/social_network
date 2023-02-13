const express = require("express")
const router = express.Router()
const multer = require("multer") //subir archivos
const postController = require("../controllers/post")

const { auth } = require("../middlewares/auth")

//Configuracion de subida de multer 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/user-posts")
    },
    filename: (req, file, cb) => {
        cb(null, "post-" + Date.now() + "-" + file.originalname)
    }

})
const uploadsMW = multer({ storage })

//Defining routes
router.get("/test-post", postController.testPost)
router.post("/save-post", auth, postController.save)

router.get("/detail/:id", auth, postController.detail)
router.delete("/remove/:id", auth, postController.remove)
router.get("/user-posts/:id/:page?", auth, postController.getPostsFromUser)
router.post("/upload/:id", [auth,uploadsMW.single("file0")], postController.upload)
router.get("/post-image/:filename", postController.showPostImage)

router.get("/feed-posts/:page?", auth, postController.feedPosts)

//Export Router
module.exports = router