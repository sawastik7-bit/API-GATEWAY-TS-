import { Queue } from 'bullmq';
const logQueue = new Queue('logQueue', {
    connection: {
        host: 'localhost',
        port: 6379
    }
});
console.log('log queue connected');
const logger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', async () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.originalUrl,
            statusCode: req.statusCode ?? 0,
            duration,
            timestamp: new Date().toISOString(),
        };
        try {
            await logQueue.add('log', logData);
            console.log(`[Logger] job pushed to queue`);
        }
        catch (error) {
            console.error(`[Logger] failed to push the job into the queue`);
        }
    });
    next();
};
export default logger;
