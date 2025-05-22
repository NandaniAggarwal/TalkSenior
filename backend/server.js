const express=require('express');
const dotenv=require('dotenv');
const { chats } = require('./data/data');
const connectDB = require('./config/db');
const userRoutes=require('./Routes/userRoutes')
const {notFound ,errorHandler}= require('./Middleware/errorMiddleware')
const cors = require("cors");
const chatRoutes=require('./Routes/chatRoutes')
const messageRoutes=require('./Routes/messageRoutes')


dotenv.config();
connectDB();
const app= express();

app.use(express.json())
app.use(cors());

app.get('/',(req,res)=>{
    res.send("API is running");
});

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);

app.use(notFound);
app.use(errorHandler);

const port=process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Serving on port http://localhost:${port}`);
});
