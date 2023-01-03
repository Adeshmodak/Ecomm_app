
const app=require('./app');

const dotenv=require('dotenv');

const connectdatabase=require('./config/database')

dotenv.config({path:"backend/config/config.env"});



process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log("shutting down the server due to uncaught exception");
    process.exit(1);
})

connectdatabase()

const server=app.listen(process.env.PORT,()=>{
    console.log(`server is running on :${process.env.PORT}`);
})

process.on("unhandledRejection",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`shutting down the server due to unhandled promise rejection`);

    server.close(()=>{
        process.exit(1);
    })
})