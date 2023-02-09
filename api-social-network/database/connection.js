//Archivo de conexion

//Importar mongoose
const mongoose = require("mongoose")


const connect = async () => {
    try {
        // await mongoose.connection(CONNECTION STRING/DN NAME,options(optional))/
        await mongoose.connect('mongodb://localhost:27017/social_network')

        console.log("SUCCESFULLY CONNECTED TO >>>> mongodb://localhost:27017/social_network");
    } catch (error) {
        console.log(error);
        throw new Error("Cant connect to the database ")
    }
}


module.exports = { connect }