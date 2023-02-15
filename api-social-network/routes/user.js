const express = require("express")
const router = express.Router()
const multer = require("multer") //subir archivos
const userController = require("../controllers/user")
const { auth } = require('../middlewares/auth')

//Configuracion de subida de multer 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/user-avatar")
    },
    filename: (req, file, cb) => {
        cb(null, "avatar-" + Date.now() + "-" + file.originalname)
    }

})

const uploadsMW = multer({ storage })

//Defining routes
router.get("/test-user", auth, userController.testUser)
router.post("/save-user", userController.saveUser)
router.post("/log-in", userController.login)

router.get("/profile/:id?", auth, userController.profile)
router.get("/list-users/:page?", auth, userController.listUsers)

router.put("/update", auth, userController.update)

router.post("/upload-avatar", [auth, uploadsMW.single("file0")], userController.uploadAvatar)

router.get("/show-avatar/:filename", userController.showAvatar)

router.get("/follow-numbers/:id?", auth, userController.followNumbers)
//Export Router
module.exports = router