const Order = require("../models/orderModel")
const Product = require("../models/productmodel")
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/catchAsyncError')



//Create new Order
exports.newOrder = catchAsyncError(async(req, res, next) => {

    const {
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemsPrice, 
        taxPrice, 
        shippingPrice,
        totalPrice,
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user:req.user._id
    });

    res.status(201).json({
        success: true,
        order,
    })
});


//get single order 

exports.getSingleOrder = catchAsyncError(async(req, res, next) =>{
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if(!order){
        return next(new ErrorHandler("Order not found with this id", 404));
    }
    res.status(200).json({
        success: true,
        order,
    });
})



//get logged in user orders

exports.myOrders = catchAsyncError(async(req, res, next) =>{
    const orders = await Order.find({ user: req.user._id });

 
    res.status(200).json({
        success: true,
        orders,
    });
});


//get all orders -- Admin

exports.getAllOrders = catchAsyncError(async(req, res, next) => {
    const orders = await Order.find();

    let totalAmount =0;
    orders.forEach((orders) => {
        totalAmount += orders.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    })
})

//update order Status -- Admin

exports.updateOrder = catchAsyncError(async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("order not found with this id", 404))
    }

    if(order.orderStatus==='Delivered'){
        return next( new ErrorHandler("you have already delivered this order",400))
    }

    order.orderItems.forEach(async(o) =>{
        await updateStock(o.product, o.quantity)
    });

    order.orderStatus = req.body.status;

    if(req.body.status === 'Delivered'){
        order.deliveredAt = Date.now()
    }

    await order.save({validBeforeSave: false});
    res.status(200).json({
        success: true, 
    });
   
    async function updateStock(is, quantity){
        const product = await Product.findById(id);
        product.Stock -= quantity;
        await product.save({ validateBeforeSave: false })
    }
})

//delete order -- Admin

exports.deleteOrder = catchAsyncError(async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found with this id", 404));
    }

    order.remove()
    
    res.status(200).json({
        success: true,

    })
})
