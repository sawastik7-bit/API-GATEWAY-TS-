import '../config.js';
import  {Worker} from 'bullmq';
import mongoose from 'mongoose';
import  {createServer} from 'http';
import {Server} from 'socket.io';

if(!process.env.MONGO_URI){
    throw new Error("the env variables is not loaded correctly");
}

const httpServer=createServer();

const io=new Server(httpServer,{
    cors:{
        origin:'http://localhost:5173',
        methods:['GET','POST']
    }
});

httpServer.listen(4003,()=>{
console.log("Socket.io server running on port 4003");
});

io.on('connection',(socket)=>{
console.log(`[Socket.io] Dashboard connected: ${socket.id}`);
 socket.on('disconnect', () => {
    console.log(`[Socket.io] Dashboard disconnected: ${socket.id}`);
  });
});

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Worker connected to mongoDb successfully"))
.catch(err=>console.error(`MongoDb error`,err.message));



