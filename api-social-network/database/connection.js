//Archivo de conexion

//Importar mongoose
const mongoose = require("mongoose")

require('dotenv').config()

const connect = async () => {
    try {

        const DB_URI = process.env.DB_URI
        // await mongoose.connection(CONNECTION STRING/DN NAME,options(optional))/
        await mongoose.connect(DB_URI)

        console.log("SUCCESFULLY CONNECTED");
    } catch (error) {
        console.log(error);
        throw new Error("Cant connect to the database ")
    }
}


module.exports = { connect }