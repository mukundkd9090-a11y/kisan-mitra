const express = require('express');
const router = express.Router();

const { authenticateToken, requireAdmin } = require('../middleware/auth');
const authController = require('../controllers/authController');
const centreController = require('../controllers/centreController');
const tokenController = require('../controllers/tokenController');
const adminController = require('../controllers/adminController');
const aiController = require('../controllers/aiController');
const chatController = require('../controllers/chatController');
const notificationController = require('../controllers/notificationController');
const auditController = require('../controllers/auditController');

// 1. Auth routes
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticateToken, authController.getMe);
router.get('/auth/demo-login', authController.demoLogin);

// 2. Procurement Centres & States
router.get('/centres/states', centreController.getStatesAndDistricts);
router.get('/centres', centreController.getCentres);
router.get('/centres/:id', centreController.getCentreById);

// 3. Tokens & Farmers
router.post('/tokens/generate', authenticateToken, tokenController.generateToken);
router.get('/tokens/my', authenticateToken, tokenController.getMyTokens);
router.get('/tokens/live-queue', authenticateToken, tokenController.getLiveQueueStatus);
router.get('/tokens/lookup/:tokenNumber', tokenController.getTokenByNumber);
router.get('/tokens/sms-query', tokenController.smsQuery);

// 4. Admin Management (Requires ADMIN role)
router.get('/admin/queue', authenticateToken, requireAdmin, adminController.getQueueForAdmin);
router.patch('/admin/tokens/:id/status', authenticateToken, requireAdmin, adminController.updateTokenStage);
router.post('/admin/tokens/:id/priority', authenticateToken, requireAdmin, adminController.moveToPriority);
router.post('/admin/broadcast', authenticateToken, requireAdmin, adminController.bulkBroadcast);
router.get('/admin/metrics', authenticateToken, requireAdmin, adminController.getMandiMetrics);
router.get('/admin/audit-logs', authenticateToken, requireAdmin, auditController.getAuditLogs);

// 5. Notifications
router.get('/notifications', authenticateToken, notificationController.getMyNotifications);
router.patch('/notifications/:id/read', authenticateToken, notificationController.markAsRead);

// 6. AI Microservice & Predictions
router.post('/ai/predict-wait-time', aiController.predictWaitTime);
router.post('/ai/predict-delay', aiController.predictDelay);
router.get('/ai/historical-stats', aiController.getHistoricalStats);

// 7. Agya AI Chatbot
router.post('/ai/chat', chatController.handleAgyaChat);

module.exports = router;
