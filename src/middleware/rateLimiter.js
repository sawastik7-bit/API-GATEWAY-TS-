import { Redis } from 'ioredis';
const redis = new Redis({
    host: 'localhost',
    port: 6379
});
redis.on('connect', () => {
    console.log("redis connected");
});
redis.on('error', (err) => {
    console.error('redis error', err.message);
});
const WINDOW_SIZE = 60;
const MAX_REQUESTS = 10;
const rateLimiter = async (req, res, next) => {
    const clientIP = req.ip || req.socket.remoteAddress;
    const key = `ratelimit:${clientIP}`;
    try {
        const rawCount = await redis.get(key);
        const currentCount = rawCount === null ? 0 : Number(rawCount);
        console.log(`[RateLimit] IP : ${clientIP} | Count : ${currentCount || 0}/${MAX_REQUESTS}`);
        if (currentCount === 0) {
            await redis.set(key, 1, 'EX', WINDOW_SIZE);
            next();
        }
        else if (currentCount < MAX_REQUESTS) {
            await redis.incr(key);
            next();
        }
        else {
            const ttl = await redis.ttl(key);
            console.log(`[RateLimit] IP ${clientIP} BLOCKED`);
            return res.status(429).json({
                success: false,
                message: 'Too many requests',
                limit: MAX_REQUESTS,
                retryAfter: `${ttl} seconds`,
            });
        }
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('[RateLimit] Redis error - Failing open : ', err.message);
            next();
        }
    }
};
export default rateLimiter;
