//Test actions
const testFollow = (req, res) => {

    return res.status(200).send({
        message: "Message sent from controllers/follow.js"
    })

}


//export actions
module.exports = {
    testFollow
}