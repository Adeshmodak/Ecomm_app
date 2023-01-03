
const Product=require('../models/ProductModel')
const ErrorHandler = require('../utils/errorhandler')
const catchAsyncError=require('../middleware/catchasyncerrors');
const Apifeatures = require('../utils/apifeatures');



exports.createproduct= catchAsyncError(async(req,res,next)=>{

    req.body.user= req.user.id;


    const product=await Product.create(req.body)
    res.status(201).json({
        success:true,
        product
    })


});

exports.getallproducts= catchAsyncError(async(req,res)=>{

    const resultperpage=5;
    const productcount=await Product.countDocuments()

    const apiFeatures=new Apifeatures(Product.find(),req.query).search().filter().pagination(resultperpage);
    const products=await apiFeatures.query;
   
    res.status(200).json({
        success:true,
        products
    })
});

exports.updateproduct=catchAsyncError(async(req,res,next)=>{
    let product=Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler('product not found',404))
    }
    product =await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true,useFindAndModify:false})
    res.status(200).json({
        success:true,
        product
    })
});

exports.getproductdetails=catchAsyncError(async(req,res,next)=>{
    const product= await Product.findById(req.params.id)

    if(!product)
    {
        return next(new ErrorHandler('product not found',404))

    }

    res.status(200).json({
        success:true,
        product,
        productcount
    })

});



exports.deleteproduct=catchAsyncError(async(req,res,next)=>{
    const product= await Product.findById(req.params.id);
    if(!product)
    {
        return next(new ErrorHandler('product not found',404))

    }
    await product.remove()
    res.status(200).json({
        success:true,
        message:"product deleted successfully"
    })
})