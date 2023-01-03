const express = require('express');

const app=express()
const cookieParser=require('cookie-parser');


const errormiddleware= require('./middleware/error');

app.use(express.json());
app.use(cookieParser());

const product= require('./routes/productroutes');
const user=require('./routes/userroute');

app.use("/api/v1",product);
app.use("/api/v1",user);
app.use(errormiddleware)


module.exports=app