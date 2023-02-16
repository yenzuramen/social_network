const Post = require("../models/post")
const fs = require("fs")
const path = require("path")

const followService = require("../services/followInfo")
//Test actions
const testPost = (req, res) => {

    return res.status(200).send({
        message: "Message sent from controllers/post.js"
    })

}

//Save Post

const save = (req, res) => {

    //get body data
    const params = req.body
    console.log(params.text);

    if (params.text == undefined) {
        return res.status(400).json({
            status: "error",
            message: "Post doesn't contain any text",
            text: req.body.text
        })
    }

    //Create and fill post objct
    let newPost = new Post({
        user: req.user.id,
        text: req.body.text
    })

    //save object
    newPost.save((error, savedPost) => {
        if (error || !savedPost) {
            return res.status(400).json({
                status: "error",
                message: "couldnt save post",
                text: req.body.text
            })
        }


        return res.status(200).json({
            status: "success",
            message: "Post saved!",
            savedPost
        })

    })



}

//Get One Post

const detail = (req, res) => {

    //Get Id from url
    const postId = req.params.id

    //find
    Post.findById({ _id: postId }, (error, foundPost) => {

        if (error || !foundPost) {
            return res.status(404).json({
                status: "error",
                message: "Post not found"
            })
        }
        return res.status(200).json({
            status: "success",
            message: "Post Details",
            foundPost
        })

    })



}

//Delete Post
const remove = (req, res) => {
    //get id from params
    const postId = req.params.id

    //find and delete
    Post.find({ "user": req.user.id, "_id": postId })
        .remove(error => {
            if (error) {
                return res.status(400).json({
                    status: "error",
                    message: "Couldnt delete post"
                })
            }
            return res.status(200).json({
                status: "success",
                message: "Post Removed!",
                postId
            })

        })


}

//List Posts from one user

const getPostsFromUser = (req, res) => {
    //get id
    let userId = req.params.id

    //control page
    let page = 1;

    if (req.params.page) {
        page = req.params.page
    }

    let itemsPerPage = 5

    //find populate and order
    Post.find({ "user": userId })
        .sort("-created_at")
        .populate('user', '-password -__v -role -email')
        .paginate(page, itemsPerPage, (error, postsFound, total) => {

            if (error || !postsFound || postsFound.length <= 0) {
                return res.status(404).json({
                    status: "error",
                    message: "coudnt find posts"
                })
            }
            return res.status(200).json({
                status: "success",
                message: "Posts Found!",
                currentPage: page,
                numberOfPages: Math.ceil(total / itemsPerPage),
                totalPost: total,
                postsFound
            })
        })
    //paginate 


}

//Upload image
const upload = (req, res) => {

    let postdId = req.params.id

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
    Post.findOneAndUpdate({ "user": req.user.id, "_id": postdId }, { file: req.file.filename }, { new: true }, (error, updatedPost) => {

        if (error || !updatedPost) {
            return res.status(400).json({
                status: 'error',
                message: 'couldnt update user image'
            })
        }

        return res.status(200).json({
            status: 'success',
            post: updatedPost,
            file: req.file
        })
    })


}

//Get Image
const showPostImage = (req, res) => {
    //get url param
    const filename = req.params.filename;

    //get image real path
    const realPath = "./uploads/user-posts/" + filename;

    console.log(req.params);

    //validate existence
    fs.stat(realPath, (error, exists) => {
        if (error) {
            return res.status(400).json({
                status: 'error',
                message: 'couldnt get post image'
            })
        }

        //return file 

        return res.sendFile(
            path.resolve(realPath)
        )

    })



}

//List Posts from users youre following
const feedPosts = async (req, res) => {
    //get page
    let page = req.params.page ? req.params.page : 1;
    // let page = 1

    // if (req.params.page) {
    //     page; req.params.page
    // }

    let itemsPerPage = 5;
    //get posts per page
    try {

        const { following } = await followService.mutualsIds(req.user.id)
        //ids from users you are following

        const posts = await Post.find({ user: { "$in": following } })
            .populate("user", "-password -role -__v -email")
            .sort("-created_at")
            .paginate(page, itemsPerPage, (error, postPaginated, total) => {
                if (error || !postPaginated) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'couldnt get posts'
                    })
                }

                //Find using "in", sort , populate and paginate  
                return res.status(200).json({
                    status: 'success',
                    mesage: 'Feed posts',
                    following,
                    page,
                    itemsPerPage,
                    numberOfPages: Math.ceil(total / itemsPerPage),
                    totalPosts: total,
                    postPaginated
                })
            })


    } catch (error) {
        return res.status(400).json({
            status: 'error',
            mesage: 'couldnt get feed info'
        })
    }



}







//export actions
module.exports = {
    testPost,
    save,
    detail,
    remove,
    getPostsFromUser,
    upload,
    showPostImage,
    feedPosts
}