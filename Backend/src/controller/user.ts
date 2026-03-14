import { Request, Response, NextFunction } from "express";
import { sendEmail, verify } from "../utils/otp";
import *as userService from '../service/user';
import redisClient from "../config/redisClient";
import { AppError } from "../utils/appError";
import bcrypt from 'bcrypt';
export const requestOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const user = await userService.searchUserByEmail(email);
        if (user) {
            return res.status(409).json({ message: "Tài khoản đã tồn tại" });
        }
        const result = await sendEmail(email);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp } = req.body;
        const result = await verify(email, otp);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { verifyToken, password, role } = req.body;
        const email = await redisClient.get(`verifyToken:${verifyToken}`);
        if (!email) {
            throw new AppError('Verify token không hợp lệ hoặc đã hết hạn', 400);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userService.createUser(email, hashedPassword, role);
        await redisClient.del(`verifyToken:${verifyToken}`);
        return res.status(201).json({ message: "Tạo tài khoản thành công", userId: user });

    } catch (error) {
        next(error);
    }
}
