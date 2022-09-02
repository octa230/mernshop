const Product = require('../models/productmodel')
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/catchAsyncError')
const ApiFeatures = require('../utils/apifeatures')




//Create product Admin

exports.createProduct = catchAsyncError(async(req, res, next)=>{
    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product,
    })
})


//get All Products 
exports.getAllProducts = catchAsyncError(async (req, res, next)=>{
    const resultPerPage = 5;
    const productCount = await Product.countDocuments()
    const apifeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage)
    const products = await apifeature.query;

    res.status(200).json({
        success: true,
        products,
        productCount
    })
})

//GET ALL PRODUCTS

//const resultPerPage = 8;
//const productCount = Product.countDocuments();

{/** exports.getAllProducts = catchAsyncError(async (req, res, next) => {
   const apifeature  = new ApiFeatures(await Product.find(), req.query)
   .search()
   .filter()
   .pagination(resultPerPage)

    const product = await apifeature.query;
    res.status(200).json({
        success: true,
        product,
        productCount,
         
    })
})

{/**exports.getAllproducts = async(req, res) => {

    const products = await Product.find()
    res.status(200).json({
        success: true,
        products
    })
**/}


//update Product admin

exports.updateProduct = catchAsyncError(async(req, res, next)=>{
    let product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success: false,
            message: "product not found"
        })
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product,
        productCount
    })
})

//DELETE PORDUCT admin

exports.deleteProduct = catchAsyncError(async(req,res, next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return res.status(500).json({
            success:false,
            message: 'Product not found'
        })
    }

    await product.remove();

    res.status(200).json({ 
        success:true,
        message: "product deleted sucessfully"
    })
})

//GET PRODUCT DETAILS

exports.getproductDetails = catchAsyncError(async(req, res, next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("product not found", 404));
           
    }
    res.status(200).json({
        success: true,
        product,
        productCount
    })
})

//CREATE NEW REVIEW OR UPDATE REVIEW

exports.createProductReview = catchAsyncError(async(req, res, next) => {
    const {rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number (rating),
        comment,
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString()=== req.user._id.toString())

    if(isReviewed){
        product.reviews.forEach((rev)=> {
            if(rev.user.toString() === req.user._id.toString())
            (rev.rating = rating), (rev.comment = comment);
        })
    }
    else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }


    let avg = 0;
    product.ratings = product.reviews.forEach(rev =>{
        avg += rev.rating
    }) / product.reviews.length;

    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
    })
    return product.reviews
})

//GET ALL REVIEWS OF A PRODUCT
exports.getAllProductReviews = catchAsyncError(async(req, res, next) =>{
    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    })
})

//DELETE REVIEW

exports.deleteReview = catchAsyncError(async(req, res, next) => {

    const product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler('Product not found', 404));
    }
    const reviews = product.reviews.filter((rev) => rev._id.toString() !== rev.query.id.toString());

    let avg = 0;

    reviews.forEach(rev =>{
        avg += rev.rating
    });

    const  ratings = avg / reviews.length;
    const numOfReviews = reviews.length
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    },
    {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    res.status(200).json({
        success: true,
    })
})