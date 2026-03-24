import { Request, Response, NextFunction } from 'express'
import *as savedJobService from '../service/savedJob'
import redisClient from '../config/redisClient';

export const savedJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.user!.id.toString());
        const jobId = parseInt(req.params.jobId.toString());
        const isSaved = await savedJobService.isSavedJob(userId, jobId)
        if (isSaved) {
            return res.status(409).json({ message: "Bạn đã lưu tin này rồi" });
        }
        await savedJobService.savedJob(userId, jobId);
        const cacheKeys = await redisClient.keys(`saved_jobs:u${userId}:*`);
        if (cacheKeys.length > 0) {
            await redisClient.unlink(cacheKeys);
        }
        return res.status(201).json({ message: 'Đã lưu tin thành công' });
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
            return res.status(409).json({ message: "Bạn chưa lưu tin này " });
        }
        await savedJobService.removeSavedJob(userId, jobId);
        const cacheKeys = await redisClient.keys(`saved_jobs:u${userId}:*`);
        if (cacheKeys.length > 0) {
            await redisClient.unlink(cacheKeys);
        }
        return res.status(201).json({ message: 'Đã bỏ lưu tin thành công' });
    } catch (error) {
        next(error);
    }
}
export const getMySavedJobsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.user!.id.toString());
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const cacheKey = `saved_jobs:u${userId}:p${page}:l${limit}`;
        const cachedJobs = await redisClient.get(cacheKey);

        if (cachedJobs) {
            console.log(`Lấy dữ liệu saved jobs của user ${userId} từ Redis cache`);
            return res.status(200).json(JSON.parse(cachedJobs));
        }
        const jobs = await savedJobService.getSavedJobs(userId, page, limit);

        await redisClient.setEx(cacheKey, 300, JSON.stringify(jobs));
        return res.status(200).json(jobs);
    } catch (error) {
        next(error);
    }
};