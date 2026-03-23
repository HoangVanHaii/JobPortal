import express from "express";
import * as employerController from "../controller/employer";
import { authMiddleware } from "../middleware/auth";
import { validateRequest } from "../middleware/validateRequest";
import *as employerMiddleware from "../middleware/employer";
const router = express.Router();

// router.post("/create-employer", authMiddleware, employerController.createEmployer);

export default router;
