import express from 'express';
import * as skillController from '../controller/skill';
import * as skillMiddleware from '../middleware/skill'; 
import { validateRequest } from '../middleware/validateRequest'; 

const router = express.Router();

router.get('/', skillController.getAllSkills);
router.get('/:id', skillMiddleware.skillIdValidation, validateRequest, skillController.getSkillById);
router.post('/', skillMiddleware.createSkillValidation, validateRequest, skillController.createSkill);
router.put('/:id', skillMiddleware.updateSkillValidation, validateRequest, skillController.updateSkill);
router.delete('/:id', skillMiddleware.skillIdValidation, validateRequest, skillController.deleteSkill);
export default router;