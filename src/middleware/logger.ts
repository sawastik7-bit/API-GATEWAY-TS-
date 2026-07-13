import {Queue} from 'bullmq';
import type {Request,Response,NextFunction} from 'express';


type logData={
    
}



const logQueue=new Queue('logQueue',{
    connection:{
        host:'localhost',
        port:6379
    }
});

console.log('log queue connected');

const logger=(req:Request,res:Response,next:NextFunction)=>{
    const start=Date.now();

    res.on('finish',async()=>{
        const duration=Date.now()-start;


    })

}