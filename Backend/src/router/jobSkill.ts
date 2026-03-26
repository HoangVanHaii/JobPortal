import express from 'express';
import * as jobSkillController from '../controller/jobSkill';
import * as jobSkillMiddleware from '../middleware/jobSkill'; 
import { authMiddleware, isEmployer } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest'; 

const router = express.Router(); 

router.get('/:jobId', jobSkillMiddleware.getJobSkillsValidator,validateRequest,jobSkillController.getJobSkills);
router.post('/:jobId', authMiddleware,isEmployer,jobSkillMiddleware.syncJobSkillsValidator,validateRequest,jobSkillController.syncJobSkills);
router.delete('/:jobId/:skillId', authMiddleware,isEmployer,jobSkillMiddleware.removeJobSkillValidator,validateRequest,jobSkillController.removeJobSkill);

export default router;