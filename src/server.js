import './config.js';
import express from 'express';
import rateLimiter from './middleware/rateLimiter.js';
import logger from './middleware/logger.js';
import auth from './middleware/auth.js';
const PORT = process.env.PORT || 5000;
const app = express();
app.use(rateLimiter);
app.use(logger);
app.use('/api/users', auth);
app.use('/api/products', auth);
app.get('/health', (req, res) => {
    res.json({
        success: true,
        service: 'Api Gateway',
        status: "Running",
        port: PORT,
        routes: {
            users: '/api/users -> Service A (4001)',
            products: '/api/products -> Service B (4001)'
        }
    });
});
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not recognized by the gateway`
    });
});
app.listen(PORT || 5000, () => {
    console.log("The gateway is live");
});
