
import mongoose from "mongoose";


interface LogData{
    method:string;
    status:number;
    userId:string;
    timestamp:number;
    userRole:string;
}
const logSchema=new mongoose.Schema<LogData>({
    
    method:{type:String, required:true},
    status:{type:Number, required:true},
userId:{type:String,required:true},
    timestamp:{type:Number},
    userRole:{type:String},

});

const Log=mongoose.model<LogData>('Log',logSchema);

export  {Log};
