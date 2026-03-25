import nodemailer from 'nodemailer';
import redisClient from "../config/redisClient";
import dotenv from 'dotenv';
import { AppError } from './appError';
import crypto from 'crypto';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendEmail = async (email: string) => {
    try {
        const otp = generateOTP();
        console.log(otp);
        const hashedOtp = await crypto.createHash('sha256').update(otp).digest('hex');
        await redisClient.setEx(`otp:${email}`, 300, hashedOtp);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Mã xác thực OTP của bạn',
            html: `
                ${otp}
            `,
        }
        await transporter.sendMail(mailOptions);
        return { message: `OTP đã gui đến ${email}` };
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new AppError('Failed to send OTP email', 500);
    }
}

export const verify = async (email: string, otp: string) => {
    try {
        const hashedOtp = await redisClient.get(`otp:${email}`);
        if (!hashedOtp) {
            throw new AppError('OTP không tồn tại hoặc đã hết hạn', 400);
        }
        const hashedOtpInput = await crypto.createHash('sha256').update(otp).digest('hex');
        
        if (hashedOtp !== hashedOtpInput) {
            throw new AppError('OTP không hợp lệ', 400);
        }
        const verifyToken = crypto.randomBytes(32).toString('hex');
        await redisClient.set(`verifyToken:${verifyToken}`, email, { EX: 3600 });
        await redisClient.del(`otp:${email}`);
        return { message: "OTP hợp lệ", verifyToken: verifyToken };
    } catch (error) {
        console.error('Lỗi khi xác minh OTP:', error);
        throw error instanceof AppError ? error : new AppError('Lỗi khi xác minh OTP', 500);
    }
}