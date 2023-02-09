//Test actions
const testPost = (req, res) => {

    return res.status(200).send({
        message: "Message sent from controllers/post.js"
    })

}


//export actions
module.exports = {
    testPost
}