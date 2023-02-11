const Follow = require("../models/follow")
const User = require("../models/user")

//Test actions
const testFollow = (req, res) => {

    return res.status(200).send({
        message: "Message sent from controllers/follow.js"
    })

}

//Save follow
const save = (req, res) => {

    //Get body data (USER TO FOLLOW)
    const bodydata = req.body
    const userToFollow = req.body.followed

    //get user to follow
    // User.findOne({ _id:})

    //get identified user
    let userInSession = req.user

    //Create follow object and save
    let followObj = new Follow({
        user: userInSession.id,
        followed: userToFollow
    });


    followObj.save((error, savedFollow) => {
        if (error || !savedFollow) {
            return res.state(400).send({
                status: 'error',
                message: "There's been an error saving the follow"
            })
        }

        return res.status(200).send({
            status: 'success',
            userInSession,
            savedFollow
        })

    })
}


//Unfollow (delete follow)
const unfollow = (req, res) => {
    //get user to unfollow
    let IdUserToUnfollow = req.params.userToUnfollow
    //get currentUser identifies
    let IdUser = req.user.id

    //find and remove 
    //(can also use callback and get the deleted item with findoneAndDelete)
    Follow.find(
        {
            user: IdUser,
            followed: IdUserToUnfollow
        }).deleteOne((error, followDeleted) => {

            if (error || !followDeleted) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Follow not found'
                })
            }

            return res.status(200).json({
                status: 'success',
                message: 'This is the unfollow method',
                followDeleted,
                IdUser,
                IdUserToUnfollow
            })
        })


}


//List following users

//List user followers

//export actions
module.exports = {
    testFollow,
    save,
    unfollow
}