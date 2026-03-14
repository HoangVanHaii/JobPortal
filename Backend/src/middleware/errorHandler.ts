import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        if (!err.isOperational) {
            console.error("SYSTEM ERROR:", err);
        }
        return res.status(err.stautusCode).json({
            success: false,
            message: err.isOperational ? err.message : "Internal Server Error"
        });
    }
    console.error("UNEXPECTED ERROR:", err);

    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
};