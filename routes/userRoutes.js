const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const SECRET_KEY = process.env.SECRET_KEY;


router.post('/register',
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

router.get('/register', async (req, res) => {
    try {
        const users = await User.find()
        res.status(201).json(users)
    } catch (error) {
        res.status(500).json({ error: "Enable to get user" })
    }
})

router.post('/login',
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
            console.log(username)
            const user = await User.findOne({ username })
            if (!user) {
                return res.status(500).json({ error: 'Invalid credentials' })
            }
            const isPasswordValid = await bcrypt.compare(password, user.password)
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid password' })
            }
            const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1hr' })
            res.status(201).json({ message: 'Login successful', token })
        } catch (error) {
            res.status(500).json({ error: 'error login' + error })
        }
    })

module.exports = router;
