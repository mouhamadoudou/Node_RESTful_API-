const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const axios = require('axios');
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const dbURI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.json());
app.use(cors());


mongoose.connect(dbURI)
    .then(() => {
        console.log('MongoDB connected');
        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => console.error('MongoDB connection error:', err));


app.use('/api/', userRoutes);
app.use('/api/', productRoutes);

module.exports = app;
