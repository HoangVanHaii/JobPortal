import express from 'express'
import *as messageController from '../controller/message'
import { validateRequest } from '../middleware/validateRequest';
import { getHistoryValidation } from '../middleware/message';
import { authMiddleware } from '../middleware/auth';
const router = express.Router();

router.get('/conversation', authMiddleware, messageController.getConversations);
router.get('/chat-history/:otherUserId', authMiddleware, getHistoryValidation, validateRequest, messageController.getChatHistory);

export default router;