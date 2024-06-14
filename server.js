const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')


const app = express();


app.listen(PORT, () => {
    console.log("server is connected to " + PORT)
})

app.use(bodyParser.json())
app.use(cors())
