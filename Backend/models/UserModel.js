const bcrypt = require('bcryptjs/dist/bcrypt');
const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userschema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Your Name"],
        maxlength:[30,"name cannot exceeded after 30 characters"],
        minlength:[4,"name should have more than 4 characters"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter Valid Email "]
    },
    password:
    {
        type:String,
        required:[true,"Please Enter Your Password"],
        minlength:[8,"password should have more than 8 characters"],
        select:false,
    },
    avatar:
    {
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true 
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
 
});


userschema.pre("save",async function(next){

    if(!this.isModified("password")){
        next();
    }

    this.password= await bcrypt.hash(this.password,10);

})

userschema.methods.getJWTToken= function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

userschema.methods.comparepassword= async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

userschema.methods.resetpassword=function(){

    const resettoken= crypto.randomBytes(20).toString("hex")

    this.resetPasswordToken= crypto.createHash("sha256").update(resettoken).digest("hex");

    this.resetPasswordExpire = Date.now()+15*60*1000;
    

    return resettoken;
}





module.exports=mongoose.model("user",userschema)