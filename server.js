const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./models/userSchema')
const Product = require('./models/productSchema')
const { body, validationResult } = require('express-validator');
require('dotenv').config();
const dbURI = process.env.MONGODB_URI;
const SECRET_KEY = process.env.SECRET_KEY;
const PORT = process.env.PORT;
const axios = require('axios');
const authMiddleware = require('./auth/authMiddleware');
const roleMiddleware = require('./auth/roleMiddleware');

//express
const app = express();


//mangoDb
mongoose.connect(dbURI)
    .then(() => {
        app.listen(PORT, () => {
            console.log("server is connected to " + PORT + " and connected to mangoDb")
        })
    })
    .catch((error) => {
        console.log('Unable to connect to server and/or MangoDb')
    })

//middlWare
app.use(bodyParser.json())
app.use(cors())


// middlWare auth
app.use('/product', authMiddleware);

//Routes Register
app.post('/register',
    [
        body('email').isEmail().withMessage('Enter a valid email'),
        body('username').not().isEmpty().withMessage('Username is required'),
        body('city').not().isEmpty().withMessage('city is required'),
        body('password').isLength({ min: 7 }).withMessage('Password must be at least 7 characters long')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, username, city, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ email, username, city, password: hashedPassword });
            await newUser.save();
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error signing up: ' + error });
        }
    }
);


app.get('/register', async (req, res) => {
    try {
        const users = await User.find()
        res.status(201).json(users)
    } catch (error) {
        res.status(500).json({ error: "Enable to get user" })
    }
})

app.post('/login',
    [
        body('username').not().isEmpty().withMessage('Username is required'),
        body('password').not().isEmpty().withMessage('Password is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { username, password } = req.body
            const user = await User.findOne({ username })
            if (!user) {
                return res.status(500).json({ error: 'Invalid credentials' })
            }
            const isPasswordValid = await bcrypt.compare(password, user.password)
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid password' })
            }
            const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: 'hr' })
            res.status(201).json({ message: 'Login successful', token })
        } catch (error) {
            res.status(500).json({ error: 'error login' + error })
        }
    })

// Product routes

// app.get('/products', roleMiddleware('admin'), async (req, res) => {
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.get('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


app.post('/product',
    [
        body('name').not().isEmpty().withMessage('Product name is required'),
        body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const product = await Product.create(req.body)
            res.status(200).json(product);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message })
        }
    })

app.put('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: `cannot find any product with Id ${id}` })
        }
        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
