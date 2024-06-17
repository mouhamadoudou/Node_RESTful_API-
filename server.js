const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./models/userSchema')
const Product = require('./models/productSchema')
const { body, validationResult } = require('express-validator');
require('dotenv').config();
const axios = require('axios');
const authMiddleware = require('./auth/authMiddleware');
const roleMiddleware = require('./auth/roleMiddleware');

// //express
// const app = express();


// //mangoDb
// mongoose.connect(dbURI)
//     .then(() => {
//         app.listen(PORT, () => {
//             console.log("server is connected to " + PORT + " and connected to mangoDb")
//         })
//     })
//     .catch((error) => {
//         console.log('Unable to connect to server and/or MangoDb')
//     })

// //middlWare
// app.use(bodyParser.json())
// app.use(cors())


// // middlWare auth
// app.use('/product', authMiddleware);

// // Product routes

// // app.get('/products', roleMiddleware(


// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const dotenv = require('dotenv');

// // Load environment variables
// dotenv.config();

// Constants
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const dbURI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3001;

// Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect(dbURI)
    .then(() => {
        console.log('MongoDB connected');
        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/api/', userRoutes);
app.use('/api/', productRoutes);

module.exports = app;
