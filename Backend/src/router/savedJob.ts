import express from 'express';
import *as savedJobController from '../controller/savedJob'
import { authMiddleware } from '../middleware/auth';
import { jobIdParamValidation } from '../middleware/savedJob';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

// router.get('/saved-job', authMiddleware, savedJobController.)
router.post('/saved-job', authMiddleware, jobIdParamValidation, validateRequest, savedJobController.savedJob);
router.delete('/remove-saved-job', authMiddleware, jobIdParamValidation, validateRequest, savedJobController.removeSavedJob);

export default router;