//Import dependencies
const { connect } = require('./database/connection')
const express = require('express')
const cors = require('cors')
require('dotenv').config()

//Conexion a bd
connect();

//Create node server
const app = express();
// const port = 3900
const port = process.env.API_PORT || 4000

/// Convert body data to json objects
app.use(cors())//Conf cors -middleware (Executes before the routes / endpoints ) -middleware
app.use(express.json()) //Decodes body data to json format-middleware
app.use(express.urlencoded({ extended: true })) //Decodes data with form-urlencoded -middleware


//Load routes conf (pending)
const userRoutes = require("./routes/user")
const postRoutes = require("./routes/post")
const followRoutes = require("./routes/follow")

app.use("/api/user",userRoutes)
app.use("/api/post",postRoutes)
app.use("/api/follow",followRoutes)

//Test route
// app.get("/test-route", (req, res) => {

//     return res.status(200).json(
//         {
//             id: 3,
//             content: 'sup testing',
//             more: req.body
//         }
//     )
// })


//Get the server to listen to petitions
app.listen(port, () => {
    //mesagge
    console.log("Server running on port " + port);
})