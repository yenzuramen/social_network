const Follow = require("../models/follow")

const mutualsIds = async (identifiedUserId) => {

    try {

        //get following info
        let following = await Follow.find({ "user": identifiedUserId })
            .select({ "followed": 1, "_id": 0 })
            .exec()


        let followers = await Follow.find({ "followed": identifiedUserId })
            .select({ "user": 1, "_id": 0 })
            .exec()

        let followingClean = []
        following.forEach(follow => {
            followingClean.push(follow.followed)
        })

        let followersClean = []
        followers.forEach(follow => {
            followersClean.push(follow.user)
        })



        return {
            following:followingClean,
            followers:followersClean
        }
    } catch (error) {
        return {};
    }




}

const isFollowing = async (identifiedUserId, profileUserId) => {

}

module.exports = {
    mutualsIds
}