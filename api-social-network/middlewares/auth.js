//Import dependencies
const jwt = require("jwt-simple")
const moment = require("moment")

//Import secret key
const { secret } = require("../services/jwt")


//Authentication function - MIDDLEWARE
exports.auth = (req, res, next) => {
    //Validare recibing auth header
    if (!req.headers.authorization) {

        return res.status(403).send({
            status: 'error',
            message: "This petition doesnt have authentication header"
        })
    }

    //Clean token  
    let token = req.headers.authorization.replace(/['"]+/g, '')

    //Decode token
    try {
        console.log('decoding token');
        let payload = jwt.decode(token, secret)//Se decodifica con la clave secreta
        console.log(payload);
        //Validate token exp
        if (payload.exp <= moment().unix) {//Si la fecha actual ha superado el periodo de xpiracion

            return res.status(404).send({
                status: 'error',
                message: "Token expired"
            })
        }
        //Add user data to request
        req.user = payload //se crea el atributo user y se le pasa el payload(toda la info)

    } catch (error) {
        return res.status(403).send({
            status: 'error',
            message: "Error decoding token"
        })
    }



    //Go to execute the next action
    next(); //(Se ejecuta la accion del CONTROLADOR)

}

