import express from "express";
import * as jobController from "../controller/job";
import * as searchAiController from "../controller/searchAi";
import { authMiddleware, isEmployer } from "../middleware/auth";
import { validateRequest } from "../middleware/validateRequest";
import *as jobMiddleware from "../middleware/job";
const router = express.Router();

router.get('/', jobController.getAllJobs);
router.get('/job-of-me', authMiddleware, isEmployer, jobController.getJobOfMe);
router.get('/recommended', authMiddleware, jobController.getRecommendedJobs);
router.get('/search-ai', searchAiController.searchJobsAI);  
router.get('/:id', jobController.getJobDetail)
router.post("/create-job", authMiddleware, isEmployer, jobMiddleware.createJobValidation, validateRequest, jobController.createJob);

router.delete('/soft-delete-job/:id', authMiddleware, isEmployer, jobController.closeJob);
router.put('/update-job/:id', authMiddleware, isEmployer, jobMiddleware.updateJobValidation, validateRequest, jobController.updateJob);
export default router;