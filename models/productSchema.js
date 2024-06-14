const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
    {
        name : {
            type : String,
            required : [true, "Please enter product name"]
        },
        quandtity: {
            type: Number,
            required: [true, "Please enter product quandtity"],
            default: 0
        },

        price :  {
            type: Number,
            required: [true, "Please enter product price"]
        },
        category: {
            type: String,
            required: false
        },
        image: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
)

const Product =  mongoose.model('Product', productSchema);

module.exports = Product;