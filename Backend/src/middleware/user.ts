import { body } from 'express-validator'
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

export const sendOtpValidation = [
    body('email').isEmail().withMessage('Vui lòng nhập email hợp lệ')
]
export const verifyOtpValidation = [
    body('email').isEmail().withMessage('Vui lòng nhập email hợp lệ'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP phải có 6 chữ số')
]
export const registerValidation = [
    body('verifyToken').notEmpty().withMessage('Verify token không được để trống'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự')
]