const mongoose = require('mongoose');



const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [ true, 'please add product name'],
        trim: true,
    },

    description:{
        type: String,
        required: [true, 'please add product description']
    },

    price :{
        type: Number,
        require: [true, 'please add product price'],
        maxLength: [8, 'price cannot exceed 8 characters'],
    },

    rating:{
        type: Number,
        default: 0 
    },

    images: [
        {
            public_id:{
                type: String,
                required: true,
            },
    
            url: {
                type: String,
                required: true,
            }
        },
    ],

    category: {
        type: String,
        required: [true, 'please add product category']
    },

    Stock: {
        type: Number,
        required: true,
        maxLength:[4, 'stock cannot exceed 4 charaters'],
        default: 1
    },

    numOfReviews: {
        type: Number,
        default: 0 
    },

    reviews: [
        {
            name:{
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            Comment:{
                type: String,
                required: true,
            }
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Product', productSchema)