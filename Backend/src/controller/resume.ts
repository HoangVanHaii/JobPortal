import { Request, Response, NextFunction } from "express";
import * as resumeService from '../service/resume';
import { AppError } from "../utils/appError";
import { iResumeDetail } from '../interface/resume'
import redisClient from '../config/redisClient';

export const generateSummaryWithAI = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const resumeData = req.body;
        const generatedText = await resumeService.generateResumeSummary(resumeData);

        return res.status(200).json({
            success: true,
            message: "AI đã viết xong tóm tắt cực mượt!",
            data: generatedText
        });
    } catch (error) {
        next(error);
    }
};

export const createManualResume = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const candidateId = req.user!.id; 
        const resumeData: iResumeDetail = req.body;
        const result = await resumeService.buildManualResume(candidateId, resumeData);
        if (redisClient) {
            await redisClient.del(`resumes:list:${candidateId}`);
            // await redisClient.del(`candidate:skills:${candidateId}`);
            await redisClient.del('all_skills');
        }

        return res.status(201).json({
            success: true,
            message: "Tạo CV và đồng bộ Profile Kỹ năng thành công mỹ mãn!",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const getMyResumes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const candidateId = req.user!.id;
        if (redisClient) {
            const cachedResumes = await redisClient.get(`resumes:list:${candidateId}`);
            if (cachedResumes) {
                return res.status(200).json({
                    success: true,
                    message: "Lấy danh sách CV từ Redis cực mượt!",
                    data: JSON.parse(cachedResumes)
                });
            }
        }
        const resumes = await resumeService.getCandidateResumes(candidateId);

        if (redisClient && resumes.length > 0) {
            await redisClient.setEx(`resumes:list:${candidateId}`, 3600, JSON.stringify(resumes));
        }

        return res.status(200).json({
            success: true,
            data: resumes
        });
    } catch (error) {
        next(error);
    }
};

export const getResumeDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const candidateId = req.user!.id;
        const { mongoId } = req.params; 
        const detail = await resumeService.getResumeDetail(mongoId as string, candidateId);
        return res.status(200).json({
            success: true,
            data: detail
        });
    } catch (error) {
        next(error);
    }
};

export const updateManualResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const candidateId = req.user!.id;
        const mongoId = req.params.mongoId as string; 
        const resumeData: iResumeDetail = req.body;

        const result = await resumeService.updateManualResume(candidateId, mongoId, resumeData);
        if (redisClient) {
            await redisClient.del(`resumes:list:${candidateId}`);
            await redisClient.del('all_skills');
        }

        return res.status(200).json({
            success: true,
            message: "Cập nhật CV thành công rực rỡ!",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const deleteResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const candidateId = req.user!.id;
        const mongoId = req.params.mongoId as string;
        await resumeService.deleteResume(mongoId, candidateId);
        if (redisClient) {
            await redisClient.del(`resumes:list:${candidateId}`);
        }

        return res.status(200).json({
            success: true,
            message: "Đã tiễn CV về nơi chín suối thành công!"
        });
    } catch (error) {
        next(error);
    }
};