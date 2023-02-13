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
            following: followingClean,
            followers: followersClean
        }
    } catch (error) {
        return {};
    }


}

//Individual
const isFollowing = async (identifiedUserId, profileUserId) => {
    //get following info
    //si lo sigo
    let following = await Follow.findOne({ "user": identifiedUserId, "followed": profileUserId })
    //si el me sigue
    let follower = await Follow.findOne({ "user": profileUserId, "followed": identifiedUserId })
    return {
        following,
        follower
    }

}

module.exports = {
    mutualsIds,
    isFollowing
}