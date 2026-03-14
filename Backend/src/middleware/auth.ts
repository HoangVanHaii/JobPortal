import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Chưa cung cấp token', 401);
        }
        const token = authHeader.split(' ')[1];
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = { id: decoded.userId, role: decoded.role };
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token đã hết hạn' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Token không hợp lệ' });
        }
        next(error);
    }
}
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'Admin') {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
    }
    next();
}
export const isEmployer = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'Employer') {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
    }
    next();
}
export const isCandidate = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'Candidate') {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
    }
    next();
}
        