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



//Products routes

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
