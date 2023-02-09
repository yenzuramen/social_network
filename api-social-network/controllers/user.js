//Impor model
const User = require("../models/user")

//Test actions
const testUser = (req, res) => {
    return res.status(200).send({
        message: "Message sent from controllers/users.js"
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

    //Create user object to save
    let userToSave = new User(params)

    //validate that it doesnt exist already
    User.find({
        $or: [
            { email: userToSave.email.toLowerCase() },
            { nickname: userToSave.nickname.toLowerCase() }
        ]
    }).exec((error, users) => {
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
        //cipher password

        //save user on database

        //return response

        return res.status(200).json({
            message: 'hi it works',
            params,
            userToSave
        })



    })


}


//export actions
module.exports = {
    testUser,
    saveUser
}