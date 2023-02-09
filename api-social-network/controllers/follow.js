//Test actions
const testFollow = (res, req) => {

    return res.status(200).send({
        message: "Message sent from controllers/users.js"
    })

}


//export actions
module.exports = {
    testFollow
}