const mongoose=require('mongoose');
const { stringify } = require('querystring');

const productschema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter product name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"please enter description"] 
    },
    price:{
        type:Number,
        required:[true,"please enter price"],
        maxLength:[8,"price cannot exceed 8 characters"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true 
        }
    }],
    category:{
        type:String,
        required:[true,"Please Enter Product Category"]
        
    },
    stock:{
        type:Number,
        required:[true,"please enterproduct stock"],
        maxlength:[4,"cannot excced above this"],
        default:1
    },
    numOfreviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }

        }
    ],


    user:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        required:true,
    },

   createdAt:{
       type:Date,
       default:Date.now
   }



})

module.exports=mongoose.model("Product",productschema)