//Impor model
const User = require("../models/user")

const bcrypt = require("bcrypt")

//Importing services
const jwt = require('../services/jwt')

//Test actions
const testUser = (req, res) => {
    return res.status(200).send({
        message: "Message sent from controllers/users.js",
        user:req.user
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


//export actions
module.exports = {
    testUser,
    saveUser,
    login
}