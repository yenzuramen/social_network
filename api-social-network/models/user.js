const { Schema, model } = require('mongoose')

const UserSchema = Schema({
    name: {
        type: String,
        required: true
    },
    surname: String,
    nickname: {
        type: String,
        required: true
    },
    bio: String,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "role_user"
    },
    image: {
        type: "String",
        default: "default.png"
    },
    created_at: {
        type: Date,
        default: Date.now
    }

})

//nombre para exportar, esquema del que se basa, nombre de la coleccion en la bd
module.exports= model('User',UserSchema,"users")