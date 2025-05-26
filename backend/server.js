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

const server=app.listen(port,()=>{
    console.log(`Serving on port http://localhost:${port}`);
});

const io= require('socket.io')(server,{
    pingTimeOut:60000,
    cors:{
        origin: "http://localhost:5173",
    },
});

io.on("connection",(socket)=>{
    console.log("connected to socket.io");
socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
});

socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
socket.on("typing", (room) => socket.in(room).emit("typing"));
socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
})
