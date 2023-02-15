//Impor model
const User = require("../models/user")

const bcrypt = require("bcrypt")
const mongoosePagination = require("mongoose-pagination")
//Importing services
const jwt = require('../services/jwt')
const fs = require("fs")
const path = require("path")
const followInfo = require("../services/followInfo")
const Follow = require("../models/follow");
const Post = require("../models/post")
//Test actions
const testUser = (req, res) => {
    return res.status(200).send({
        message: "Message sent from controllers/users.js",
        user: req.user
    })
}

//save-user
const saveUser = (req, res) => {

    //get date from body
    let params = req.body

    console.log(params);

    //validate them
    if ((!params.name || !params.email || !params.password || !params.nickname)) {
        return res.status(400).json({
            status: 'error',
            message: 'validation not passed'
        })
    }
    console.log('Passed validation');


    //validate that it doesnt exist already
    User.find({
        $or: [
            { email: params.email.toLowerCase() },
            { nickname: params.nickname.toLowerCase() }
        ]
    }).exec(async (error, users) => {
        if (error) {
            return res.status(400).json({
                status: 'error',
                message: 'Error consulting to db'
            })
        }

        if (users.length >= 1) {
            return res.status(200).json({
                status: 'succes',
                message: 'username or email already exist'
            })
        }

        // bcrypt.hash(userToSave.password, 10, (error, pwdHashed) => {
        //     console.log(pwdHashed);
        //     userToSave.password = pwdHashed;
        //     console.log(userToSave);
        // })


        //cipher password (data to ciph, iteration num)
        let hashedPwd = await bcrypt.hash(params.password, 10)
        params.password = hashedPwd

        //Create user object to save
        let userToSave = new User(params)

        //save user on database
        userToSave.save((error, savedUser) => {
            if (error || !savedUser) return res.status(500).json({ status: 'error', message: 'couldnt save user' })


            //return response

            return res.status(200).json({
                status: 'success',
                message: 'user saved',
                savedUser
            })

        })
    })
}

const login = (req, res) => {
    //Get params from body
    const params = req.body;

    if (!params.email || !params.password) {
        return res.status(400).json({
            status: 'error',
            message: 'not complete data'
        })
    }

    //Search user on bd
    User.findOne({ email: params.email.toLowerCase() })
        // .select({ "password": 0 })
        .exec((error, userFound) => {

            if (error || !userFound) {
                return res.status(400).json({
                    status: 'error',
                    message: 'not found'
                })
            }

            //Validate password
            let pwd = bcrypt.compareSync(params.password, userFound.password)
            if (!pwd) {

                return res.status(400).json({
                    status: 'error',
                    message: 'contraseña incorrecta'
                })

            }
            //if correct return token
            let token = jwt.createToken(userFound)
            //or return user data

            return res.status(200).json({
                status: 'success',
                message: 'user found',
                userFound: {
                    name: userFound.name,
                    nickname: userFound.nickname,
                    id: userFound._id
                },
                token
            })

        })




}

//get user info for the profile
const profile = async (req, res) => {
    //------------correction
    let id = '';


    //Get user id from url param
    id = req.params.id

    if (!req.params.id) {
        id = req.user.id
    }
    //Query to get user data
    //let test = await User.findById(id).exec() //debe ir dentro de un trycatch
    User.findById(id)
        .select({ password: 0, role: 0 })
        .exec(async (error, userFound) => {
            if (error || !userFound) {
                return res.status(400).json({
                    status: 'success',
                    message: 'user NOT found',
                    // test
                })
            }
            console.log('-----------');
            console.log(userFound);

            //Postertiormente informacion de folow
            const returnedFollowInfo = await followInfo.isFollowing(req.user.id, id)

            //Return result
            return res.status(200).json({
                status: 'success',
                message: 'user found',
                user: userFound,
                following: returnedFollowInfo.following,
                isFollower: returnedFollowInfo.follower
                // test
            })
        })


}

//Lista de usuarios con paginacion
const listUsers = (req, res) => {
    let page = 1;
    //Get current page
    console.log(req.params.page);

    if (req.params.page) page = parseInt(req.params.page);

    //Consult to mongoose pagination (current page, items per page)
    let itemsPerPage = 4;

    User.find()
        .select("-password -email -role -__v")
        .sort('_id')
        .paginate(page, itemsPerPage, async (error, users, total) => {
            if (error || !users) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Query error or users not found',
                })
            }

            //posteriormente info de follows
            let { following, followers } = await followInfo.mutualsIds(req.user.id)


            //Return result
            return res.status(200).json({
                status: 'success',
                page,
                itemsPerPage,
                total,
                users,
                pages: Math.ceil(total / itemsPerPage),
                following,
                followers
            })

        })

}

const update = (req, res) => {
    //Get user info to update
    let userIdentity = req.user;
    let userToUpdate = req.body;

    //Delete extra attrib
    delete userToUpdate.iat;
    delete userToUpdate.exp;
    delete userToUpdate.role;
    delete userToUpdate.image;

    //Validate if user exists y Si llega password cifrarla

    //validate that it doesnt exist already
    User.find({
        $or: [
            { email: userToUpdate.email.toLowerCase() },
            { nickname: userToUpdate.nickname.toLowerCase() }
        ]
    }).exec(async (error, users) => {
        if (error) {
            return res.status(400).json({
                status: 'error',
                message: 'Error consulting to db'
            })
        }

        //comprobar que el usuario que edita es el usuario logeado
        let userIsset = false;
        users.forEach(user => {
            if (user && user._id != userIdentity.id) {
                userIsset = true;
            }
        })

        if (userIsset) {
            return res.status(400).json({
                status: 'success',
                message: 'el usuario ya eiste'
            })
        }
        // bcrypt.hash(userToSave.password, 10, (error, pwdHashed) => {
        //     console.log(pwdHashed);
        //     userToSave.password = pwdHashed;
        //     console.log(userToSave);
        // })

        if (userToUpdate.password) {
            //cipher password (data to ciph, iteration num)
            let hashedPwd = await bcrypt.hash(userToUpdate.password, 10)
            userToUpdate.password = hashedPwd
        } else {
            delete userToUpdate.password
        }

        try {
            //Search and update
            let userUpdated = await User.findByIdAndUpdate({ _id: userIdentity.id }, userToUpdate, { new: true });
            if (!userUpdated) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error updating'
                })
            }
            //Return result
            return res.status(200).json({
                status: 'success',
                message: 'update user method',
                userUpdated,
                userIdentity,
                userToUpdate

            })

        } catch (error) {
            console.log('entra aqui');
            // console.log(error);

            return res.status(500).json({
                status: 'error',
                message: 'Error updating'
            })

        }
    })

}

const uploadAvatar = (req, res) => {

    //Get file
    if (!req.file) {
        return res.status(404).json({
            status: 'error',
            message: 'Error sending image'
        })
    }

    //Get file name and ext
    let originalName = req.file.originalname;
    let imgSplit = originalName.split('\.')
    let ext = imgSplit[1].toLowerCase()

    //validate ext
    if (ext !== 'png' && ext !== 'jpeg' && ext !== 'jpg' && ext !== 'gif') {
        const filePath = req.file.path
        const deletedFile = fs.unlinkSync(filePath)    //delete file if wrong
        console.log(ext !== 'jpg');
        return res.status(400).json({
            status: 'error',
            message: 'file type not allowed',
            ext
        })
    }

    //if valid  //save on bd if right
    User.findOneAndUpdate({ _id: req.user.id }, { image: req.file.filename }, { new: true }, (error, updatedUser) => {

        if (error || !updatedUser) {
            return res.status(400).json({
                status: 'error',
                message: 'couldnt update user image'
            })
        }

        return res.status(200).json({
            status: 'success',
            user: updatedUser,
            file: req.file
        })
    })


}

const showAvatar = (req, res) => {
    //get url param
    const filename = req.params.filename;

    //get image real path
    const realPath = "./uploads/user-avatar/" + filename;

    console.log(req.params);

    //validate existence
    fs.stat(realPath, (error, exists) => {
        if (error) {
            return res.status(400).json({
                status: 'error',
                message: 'couldnt get user image'
            })
        }

        //return file 

        return res.sendFile(
            path.resolve(realPath)
        )

    })



}

const followNumbers = async (req, res) => {
    let userId = req.user.id;

    if (req.params.id) {
        userId = req.params.id;
    }

    try {
        const following = await Follow.count({ "user": userId });

        const followers = await Follow.count({ "followed": userId });

        const posts = await Post.count({ "user": userId });

        return res.status(200).send({
            userId,
            following,
            followers,
            posts
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error en los contadores",
            error
        });
    }
}

//export actions
module.exports = {
    testUser,
    saveUser,
    login,
    profile,
    listUsers,
    update,
    uploadAvatar,
    showAvatar,
    followNumbers
}