import { body } from 'express-validator'

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
export const loginValidation = [
    body('email').isEmail().withMessage('Vui lòng nhập email hợp lệ'),
    body('password').notEmpty().withMessage('Mật khẩu không được để trống')
]
export const refreshTokenValidation = [
    body('refreshToken').notEmpty().withMessage('Refresh token không được để trống')
]
