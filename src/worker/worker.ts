import '../config.js';
import  {Worker} from 'bullmq';
import mongoose from 'mongoose';
import  {createServer} from 'http';
import {Server} from 'socket.io';
import {Log} from "./schema/dbSchema.js";

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


const calculateStats = async () => {
    const currentTime: number = Date.now();
    const oneMinuteAgo: number = currentTime - 60 * 1000;

    const totalRequests = await Log.countDocuments();

    const requestsPerMinute: number = await Log.countDocuments({
        timestamp: { $gte: oneMinuteAgo }
    });

    const avgResult = await Log.aggregate([
        {
            $group: {
                _id: null,
                avgDuration: { $avg: '$duration' }
            }
        }
    ]);

    const averageResponse = avgResult[0]?Math.round(avgResult[0].avgDuration) : 0;

    const errorCount = await Log.countDocuments({
        statusCode: { $gte:400}
    });

    const errorRate=totalRequests>0?Math.round((errorCount / totalRequests) * 100) : 0;

    const topRoutes=await Log.aggregate([
        {
            $group: {
                _id: '$url',
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
            $project: {
                url: '$_id',
                count: 1,
                _id: 0
            }
        }
    ]);

    const recentLogs = await Log.find()
        .sort({ timestamp: -1 })
        .limit(5)
        .select('url method statusCode duration timestamp -_id');

    return {
        totalRequests,
        requestsPerMinute,
        averageResponse,
        errorRate,
        topRoutes,
        recentLogs
    };
};



const worker = new Worker(
  'logQueue',
  async (job) => {
    console.log(`[Worker] Processing job ${job.id}`);


    const log = new Log(job.data);
    await log.save();
    console.log(`[Worker] Log saved to MongoDB`);


    const stats = await calculateStats();


    io.emit('stats', stats);
    console.log(`[Worker] Stats emitted to dashboard`);
  },
  {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379
    }
  }
);



worker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
    if(job){
  console.error(`[Worker] Job ${job.id} failed`, err.message);
}});

worker.on('error', (err) => {
  console.error('[Worker] Worker error:', err.message);
});

console.log('Worker is running and listening to queue...');