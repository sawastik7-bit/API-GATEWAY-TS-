import mongoose from "mongoose";

interface LogData {
    method: string;
    url: string;
    statusCode: number;
    duration: number;
    timestamp: number;
}

const logSchema = new mongoose.Schema<LogData>({
    method: { type: String, required: true },
    url: { type: String, required: true },
    statusCode: { type: Number, required: true },
    duration: { type: Number, required: true },
    timestamp: { type: Number, required: true },
});

const Log = mongoose.model<LogData>('Log', logSchema);

export { Log };