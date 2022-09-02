const express = require('express');
const getAllproducts = require('../controllers/productController')
const { 
    getAllProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getproductDetails, 
    createProductReview,
    getAllProductReviews,
    deleteReview,
} = require('../controllers/productController');

const {isAuthenticatedUser, authorizeRoles}  = require("../middleware/auth")

const router = express.Router();

router.route('/products').get(getAllProducts)

router
.route('/product/new')
.post(isAuthenticatedUser, authorizeRoles('admin'), createProduct)

router
.route('/admin/product/:id')
.put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
.delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct)

router.route('/product/:id').get(getproductDetails);

router.route('/review').put(isAuthenticatedUser, createProductReview)

router.route('/reviews')
.get(getAllProductReviews)
.delete(isAuthenticatedUser, deleteReview)


module.exports =  router 