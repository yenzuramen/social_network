const jwt = require("jwt-simple")
const moment = require("moment")

//Secret key to decode token
const secret = "SCRT_KEY_1002231058";

//Create function to generate tokens
exports.createToken = (user) => {

    const payload = {
        id: user._id,
        name: user.name,
        surname: user.name,
        nickname: user.nickname,
        emanil: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix, //momento en el que estamos generando el token
        exp: moment().add(30, "days").unix //expiracion
    }

    //Return JWT codified
    return jwt.encode(payload, secret)
}

// module.exports = {
//     createToken
// }