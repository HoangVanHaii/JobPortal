import { Request, Response, NextFunction } from "express";
import *as employerService from "../service/employer";
import { Employer } from "../interface/employer";

export const createEmployer = async (req: Request, res: Response, next: NextFunction) => {  
    try {
        const employer: Employer = req.body;
        const employerId = await employerService.createEmployer(employer);
        res.status(201).json({ employerId });
    } catch (error) {
        next(error);
    }
}