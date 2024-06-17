const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Product = require('../models/productSchema');


router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


router.post('/product',
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

router.put('/product/:id', async (req, res) => {
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

module.exports = router;