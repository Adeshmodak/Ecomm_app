const ErrorHandler=require('../utils/errorhandler')
const catchasyncerrors=require('../middleware/catchasyncerrors')
const User = require('../models/UserModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendemail.js')

exports.registerUser = catchasyncerrors(async(req,res,next)=>
{
    const{name,email,password}= req.body

    const user= await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"this is a simple id",
            url:"profilepicurl",

        }

    });




    sendToken(user,201,res)
});

exports.loginuser = catchasyncerrors(async(req,res,next)=>{
    const{email,password}=req.body;

    if(!email || !password)
    {
        return next(new ErrorHandler("Please enter email & password",400))
    }
    const user= await User.findOne({email}).select("+password")

    if(!user)
    {

        return next(new ErrorHandler("Invalid Email or password",401))

    }
     const isPasswordMatched = await user.comparepassword(password);
    
     if(!isPasswordMatched)
     {
 
         return next(new ErrorHandler("Invalid Email or password",401))
 
     } 
    sendToken(user,200,res)


    


})


exports.logoutuser = catchasyncerrors(async(req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    })


    res.status(200).json({
        success:true,
        message:"Logged Out",
    })
})


exports.forgotpassword=catchasyncerrors(async(req,res,next)=>{

    const user= await User.findOne({email:req.body.email});
    if(!user)
    {
        return next(new ErrorHandler("user not found",404));

    }

    const resettoken=user.resetpassword();

    await user.save({validateBeforSave:false});

    const resetpasswordurl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resettoken}`;

    const message =`your reset password token is :- \n\n ${resetpasswordurl} \n\n If you have not requested this email then please ignore it`;

    try{
        
        await sendEmail({
            email:user.email,
            subject:`Ecommerce Password Recovery`,
            message,
        })

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`,
        })


    }
    catch(error){
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;

        await user.save({validateBeforSave:false})


        return next(new ErrorHandler(error.message,500))
    }

})

// Reset Password
exports.resetPassword = catchasyncerrors(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(
        new ErrorHander(
          "Reset Password Token is invalid or has been expired",
          400
        )
      );
    }
  
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHander("Password does not password", 400));
    }
  
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save();
  
    sendToken(user, 200, res);
  });

  

