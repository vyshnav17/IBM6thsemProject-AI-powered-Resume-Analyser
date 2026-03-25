import express from 'express';
import proxy from 'express-http-proxy';
import gatewayConfig from '../config/gatewayConfig.js';

const router = express.Router();

const proxyErrorHandler = (err, res, next) => {
    console.error('Proxy Error:', err.message);
    res.status(502).json({ error: 'Service Unavailable', details: err.message });
};

// Route proxies
router.use('/users', proxy(gatewayConfig.USER_SERVICE_URL, { proxyErrorHandler }));
router.use('/analyzer', proxy(gatewayConfig.ANALYZER_SERVICE_URL, {
    parseReqBody: false,
    proxyErrorHandler
}));
router.use('/reports', proxy(gatewayConfig.REPORT_SERVICE_URL, { proxyErrorHandler }));
router.use('/notifications', proxy(gatewayConfig.NOTIFICATION_SERVICE_URL, { proxyErrorHandler }));
router.use('/builder', proxy(gatewayConfig.BUILDER_SERVICE_URL, { proxyErrorHandler }));

export default router;
