import { Router } from "express";
import * as employerMiddleware from '../middleware/employer'
import { validateRequest } from "../middleware/validateRequest";
import { authMiddleware, isAdmin, isEmployer } from "../middleware/auth";
import * as employerController from '../controller/employer'
const router = Router();

router.put('/:EmployerID/status', authMiddleware, isEmployer, employerMiddleware.updateStatus, validateRequest, employerController.UpdateStatusEmployer);
router.get('/pending', authMiddleware, isEmployer, employerController.GetPendingEmployers);



export default router;
