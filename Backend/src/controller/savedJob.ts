import { Request, Response, NextFunction } from 'express'
import *as savedJobService from '../service/savedJob'
import redisClient from '../config/redisClient';
import { AppError } from '../utils/appError';

export const savedJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.user!.id.toString());
        const jobId = parseInt(req.params.jobId.toString());
        const isSaved = await savedJobService.isSavedJob(userId, jobId)
        if (isSaved) {
            throw new AppError('Bạn đã lưu tin này rồi', 409);
        }
        await savedJobService.savedJob(userId, jobId);
        const cacheKeys = await redisClient.keys(`saved_jobs:u${userId}:*`);
        if (cacheKeys.length > 0) {
            await redisClient.unlink(cacheKeys);
        }
        return res.status(201).json({
            success: true,
            message: 'Đã lưu tin thành công'
        });
    } catch (error) {
        next(error);
    }
}
export const removeSavedJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.user!.id.toString());
        const jobId = parseInt(req.params.jobId.toString());
        const isSaved = await savedJobService.isSavedJob(userId, jobId)
        if (!isSaved) {
            throw new AppError("Bạn chưa lưu tin này ", 400)
        }
        await savedJobService.removeSavedJob(userId, jobId);
        const cacheKeys = await redisClient.keys(`saved_jobs:u${userId}:*`);
        if (cacheKeys.length > 0) {
            await redisClient.unlink(cacheKeys);
        }
        return res.status(201).json({
            success: true,
            message: 'Đã bỏ lưu tin thành công'
        });
    } catch (error) {
        next(error);
    }
}
export const getMySavedJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.user!.id.toString());
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const cacheKey = `saved_jobs:u${userId}:p${page}:l${limit}`;
        const cachedJobs = await redisClient.get(cacheKey);

        if (cachedJobs) {
            console.log(`Lấy dữ liệu saved jobs của user ${userId} từ Redis cache`);
            return res.status(200).json({
                success: true,
                message: "Lấy dữ liệu công việc đã lưu thành công",
                data: cachedJobs
            });
        }
        const jobs = await savedJobService.getSavedJobs(userId, page, limit);

        await redisClient.setEx(cacheKey, 300, JSON.stringify(jobs));
        return res.status(200).json({
            success: true,
            message: "Lấy dữ liệu công việc đã lưu thành công", 
            data: jobs
        });
    } catch (error) {
        next(error);
    }
};

export const isSavedJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.user!.id.toString());
        const jobId = parseInt(req.params.jobId.toString());
        const isSaved = await savedJobService.isSavedJob(userId, jobId);
        return res.status(200).json({
            success: true,
            message: "Kiểm tra trạng thái lưu tin thành công",
            data: isSaved
        });
    } catch (error) {
        next(error);
    }
}