const app = require('./app')

const dotenv = require('dotenv')
const connectDatabase = require('./config/db')

//Handling uncaught exceptions
process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`)
    console.log(`shutting down server due to uncaught exception`);
    process.exit(1)

})


//config

dotenv.config({path:"./config/config.env"});

//connect to db
connectDatabase();

app.listen(process.env.PORT,()=>{
    console.log(`server is running on http://localhost:${process.env.PORT}`)
})

//unhandled promise rejection
process.on("uncaughtException", (err)=>{
    console.log(`Error:${err.message}`);
    console.log(`shutting down server due to unhandles promise rejection`);
    server.close(()=>{
        process.exit(1);
    });
})