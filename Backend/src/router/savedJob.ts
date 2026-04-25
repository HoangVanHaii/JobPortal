import express from 'express';
import *as savedJobController from '../controller/savedJob'
import { authMiddleware } from '../middleware/auth';
import { jobIdParamValidation } from '../middleware/savedJob';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

router.get('/', authMiddleware, savedJobController.getMySavedJobs);
router.get('/:jobId', authMiddleware, jobIdParamValidation, validateRequest, savedJobController.isSavedJob);
router.post('/:jobId', authMiddleware, jobIdParamValidation, validateRequest, savedJobController.savedJob);
router.delete('/unsave-job/:jobId', authMiddleware, jobIdParamValidation, validateRequest, savedJobController.removeSavedJob);

export default router;