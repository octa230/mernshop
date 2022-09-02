const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/catchAsyncError')
const User = require("../models/userModel");
const sendToken = require('../utils/jwtToken');
const crypto = require('crypto')
const sendEmail = require("../utils/sendEmail")


//Register a user

exports.registerUser = catchAsyncError(async(req, res, next) =>{
    const {name, email, password} = req.body;

    const user = await User.create({
        name, email, password,
        avatar:{
            public_id: 'basic id',
            url: 'profilepicUrl'
        }
    })
    sendToken(user, 201, res)
})


exports.loginUser = catchAsyncError(async(req, res, next) =>{
    const {email, password } = req.body;

    //check for user email and password

    if(!email || !password){
        return next(new ErrorHandler("please enter Email & password", 400))
    }

    const user = await User.findOne({email}).select("+password")

    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid password", 401));
    }

    sendToken(user, 200, res)
});


//Logout user

exports.logout = catchAsyncError(async(req, res, next) =>{

    res.cookie("token", null,{
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: 'Logged out'
    });
});

//Forgot Password 

exports.forgotPassword = catchAsyncError(async(req, res, next) =>{
    const user = await User.findOne({email: req.body.email});

    if(!user){
        return next(new ErrorHandler("user not found", 404))
    }

    //Get ResetPassword Token

   const resetToken =  user.getResetPasswordToken()

   await user.save({ validateBeforeSave: false })

   const resetPasswordUrl = `${req.protocal}://${req.get("host")}/api/v1/password/reset/${resetToken}`

   const message = `your password reset token is :- \n\n${resetPasswordUrl} \n\nIf you've not requested for this email, please disregard `;

   try {

    await sendEmail({
        email:user.email,
        subject: `Flowershop password Recovery`,
        message,
    })
    res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
    })
    
   } catch (error) {
    user.getResetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500))
   }
})

exports.resetPassword = catchAsyncError(async(req, res, next) =>{

    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user = await User.findOne({
        resetPasswordToken, 
        resetPasswordExpire:{$gt : Date.now()}
    })

    if(!user){
        return next(new ErrorHandler("Invalid password reset token", 400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password doesn't match", 400));

    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;


    await user.save();

    sendToken(user, 200, 200, res)

})

//Get User Details

exports.getUserDetails = catchAsyncError(async( req, res, next) =>{

    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    })

})

//update user password

exports.updatePassword = catchAsyncError(async( req, res, next) =>{

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next( new ErrorHandler("Invalid old password", 401))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next( new ErrorHandler(" Password don't match", 401))

    }

    user.password = req.body.newPassword;

    await user.save()

    sendToken(user, 200, res)

})


//update user profile

exports.updateProfile = catchAsyncError(async( req, res, next) =>{

    const newUserData={
        name:req.body.name,
        email:req.body.email,
    }

    //add cloudinary later

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false, 
    })
   res.status(200).json({
    success: true,
   })
})


//GET ALL USERS (admin)

exports.getAllUsers = catchAsyncError(async(req, res, next)=>{
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    })
})


//GET SINGLE USER (admin)

exports.getSingleUser = catchAsyncError(async(req, res, next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`user with id: ${req.params.id} does not exist`))
    }

    res.status(200).json({
        success: true,
        user
    })
})


//update user Role(user/ admin)

exports.updateUserRole = catchAsyncError(async( req, res, next) =>{

    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role: req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false, 
    })
   res.status(200).json({
    success: true,
   })
})

//delete user, Admin

exports.deleteUser = catchAsyncError(async( req, res, next) =>{

    const user = await User.findById(req.params.id);
    //remove cloudinary later

   if(!user){
    return next(new ErrorHandler(`user with ${req.params.id} doesn't exist`))
   }

   await user.remove()

   res.status(200).json({
    success: true,
    message: "User Deleted Successfully"
   })
})

