import { Request, Response, NextFunction } from "express";
import * as candidateService from '../service/candidate';
import { AppError } from "../utils/appError";
import { uploadToCloudinary } from '../utils/uploadToCloudinary';

export const upsertProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        let avatarUrl = req.body.AvatarUrl; 

        if (req.file) {
            avatarUrl = await uploadToCloudinary('Candidates', req.file);
        }

        const profileData = {
            ...req.body,
            CandidateID: userId,
            AvatarUrl: avatarUrl 
        };

        await candidateService.upsertCandidateProfile(profileData);

        return res.status(200).json({ 
            success: true,
            message: "Cập nhật hồ sơ ứng viên thành công!",
            data: profileData
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const profile = await candidateService.getCandidateProfile(userId);
        if (!profile) {
            throw new AppError("Không tìm thấy thông tin hồ sơ ứng viên!", 404);
        }
        return res.status(200).json({
            success: true,
            message: "Lấy thông tin hồ sơ thành công",
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

export const getSkills = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const profile = await candidateService.getCandidateSkills(userId);
        if (!profile) {
            throw new AppError("Không tìm thấy kỹ năng hồ sơ ứng viên!", 404);
        }
        return res.status(200).json({
            success: true,
            message: "Lấy thông tin kỹ năng hồ sơ thành công",
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

export const analyzeSkillsText = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { rawText } = req.body; 
        if (!rawText) throw new AppError("Vui lòng nhập mô tả kỹ năng!", 400);

        const finalSkills = await candidateService.analyzeTextWithAI(rawText);

        return res.status(200).json({
            success: true,
            message: "Phân tích kỹ năng thành công!",
            data: finalSkills 
        });
    } catch (error: any) {
        if (error.message === "AI_PARSE_ERROR") {
            next(new AppError("Hệ thống AI đang quá tải không thể phân tích, vui lòng thử lại sau!", 500));
        } else {
            next(error);
        }
    }
};

export const saveAnalyzedSkills = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id; 
        const { skills } = req.body; 

        if (!skills || !Array.isArray(skills)) {
            throw new AppError("Dữ liệu kỹ năng không hợp lệ!", 400);
        }

        await candidateService.updateCandidateSkills(userId, skills);

        return res.status(200).json({
            success: true,
            message: "Cập nhật hồ sơ kỹ năng thành công!"
        });
    } catch (error) {
        next(error);
    }
};