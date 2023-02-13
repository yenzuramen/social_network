const Follow = require("../models/follow")
const User = require("../models/user")
const FollowInfo = require("../services/followInfo")

const mongoosePagination = require("mongoose-pagination")

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


//List following users by Id
const followingList = (req, res) => {
    //get current user id
    let userId = req.user.id;

    //know if id comes from url param
    if (req.params.id) {
        userId = req.params.id;
    }

    //know if pages come from url param
    let page = 1
    if (req.params.page) {
        page = req.params.page
    }
    //Users per pages
    let usersPerPage = 5;

    //Find follows, get their info and populate
    Follow.find({ user: userId })
        .populate("user followed", "-password -role -__v")
        .paginate(page, usersPerPage, async (error, followsFound, total) => {

            if (error) {

                return res.status(400).json({
                    status: 'error',
                    message: 'Theres been an error'
                })

            }
            console.log(followsFound);
            //from this list
            //how many users follow the one in session (works for when consulting from other people)

            let { following, followers } = await FollowInfo.mutualsIds(req.user.id)
            console.log('tssssssssssssssssssss');
            console.log(following);
            console.log(followers);

            return res.status(200).json({
                status: 'success',
                message: 'Following List',
                total,
                totalPages: Math.ceil(total / usersPerPage),
                followsFound,
                following,
                followers
            })
        }
        )


}

//List user followers
const followersList = (req, res) => {
    //get current user id
    let userId = req.user.id;

    //know if id comes from url param
    if (req.params.id) {
        userId = req.params.id;
    }

    //know if pages come from url param
    let page = 1
    if (req.params.page) {
        page = req.params.page
    }
    //Users per pages
    let usersPerPage = 5;
     //Find follows, get their info and populate
     Follow.find({ followed: userId })
     .populate("user", "-password -role -__v")
     .paginate(page, usersPerPage, async (error, followsFound, total) => {

         if (error) {

             return res.status(400).json({
                 status: 'error',
                 message: 'Theres been an error'
             })

         }
         console.log(followsFound);
         //from this list
         //how many users follow the one in session (works for when consulting from other people)

         let { following, followers } = await FollowInfo.mutualsIds(req.user.id)
        //  console.log('tssssssssssssssssssss');
         console.log(following);
         console.log(followers);

         return res.status(200).json({
             status: 'success',
             message: 'Following List',
             total,
             totalPages: Math.ceil(total / usersPerPage),
             followsFound,
             following,
             followers
         })
     }
     )

}

//export actions
module.exports = {
    testFollow,
    save,
    unfollow,
    followingList,
    followersList
}