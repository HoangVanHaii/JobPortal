import { Router } from "express";
import * as resumeController from "../controller/resume";
import { authMiddleware, isEmployer } from "../middleware/auth";
import * as resumeMiddleware from '../middleware/resume';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();
router.post("/generate-summary", authMiddleware,resumeMiddleware.generateSummaryValidation, validateRequest, resumeController.generateSummaryWithAI);
router.post("/build", authMiddleware, resumeMiddleware.buildResumeValidation, validateRequest, resumeController.createManualResume);
router.get("/", authMiddleware, resumeController.getMyResumes);
router.get("/detail/:mongoId", authMiddleware, resumeMiddleware.ResumeDetailIDValidation,validateRequest,resumeController.getResumeDetail);
router.put("/:mongoId", authMiddleware, resumeMiddleware.ResumeDetailIDValidation, resumeMiddleware.buildResumeValidation,validateRequest,resumeController.updateManualResume);
router.delete("/:mongoId", authMiddleware, resumeMiddleware.ResumeDetailIDValidation,validateRequest,resumeController.deleteResume);
router.get("/employer/:mongoId",authMiddleware,isEmployer,resumeMiddleware.ResumeDetailIDValidation,validateRequest,resumeController.getResumeDetailByEmployer);
export default router;
