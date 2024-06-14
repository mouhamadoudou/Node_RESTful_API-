const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const PORT = process.env.PORT;

const app = express();


mongoose.connect(dbURI)
    .then(() => {
        app.listen(PORT, () => {
            console.log("server is connected to " + PORT + " and connected to mangoDb")
        })
    })
    .catch((error) => {
        console.log('Unable to connect to server and/or MangoDb')
    })


app.use(bodyParser.json())
app.use(cors())
