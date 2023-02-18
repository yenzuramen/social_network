const validator = require("validator")

const validate = (params) => {
    console.log('validating........');
    console.log(params);

    let name = !validator.isEmpty(params.name) &&
        validator.isLength(params.name, { min: 2, max: undefined })
        && validator.isAlpha(params.name, "es-ES")


    let surname = !validator.isEmpty(params.surname) &&
        validator.isLength(params.surname, { min: 2, max: undefined })
        && validator.isAlpha(params.surname, "es-ES")

    let nickname = !validator.isEmpty(params.nickname) &&
        validator.isLength(params.nickname, { min: 2, max: undefined })
    // && validator.isAlpha(params.surname,"es-ES")

    let email = !validator.isEmpty(params.email) &&
        validator.isEmail(params.email)

    let password = !validator.isEmpty(params.password)

    let bio = true;
    if (params.bio) {
        bio = validator.isLength(params.bio, { min: undefined, max: 255 })
    }


    // let surname
    // let nick
    // let email
    // let password

    if (!name || !surname || !nickname || !email || !password || !bio) {
        throw new Error("No se ha superado la validación")
    } else {
        console.log('advanced validation passed');
    }

}

module.exports = {
    validate
}