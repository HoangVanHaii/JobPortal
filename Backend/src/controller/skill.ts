import { Request, Response, NextFunction } from "express";
import * as skillService from '../service/skill';
import { AppError } from "../utils/appError";

export const getAllSkills = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const skills = await skillService.getAllSkills();
        return res.status(200).json({
            success: true,
            message: "Lấy danh sách kỹ năng thành công",
            data: skills
        });
    } catch (error) {
        next(error);
    }
};

export const getSkillById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const skillId = parseInt(req.params.id as string);
        const skill = await skillService.getSkillById(skillId);
        
        if (!skill) throw new AppError("Không tìm thấy kỹ năng này!", 404);

        return res.status(200).json({
            success: true,
            message: "Lấy thông tin kỹ năng thành công",
            data: skill
        });
    } catch (error) {
        next(error);
    }
};

export const createSkill = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { skillName } = req.body;
        if (!skillName) throw new AppError("Vui lòng nhập tên kỹ năng!", 400);

        const newSkill = await skillService.createSkill(skillName);
        return res.status(201).json({
            success: true,
            message: "Thêm kỹ năng thành công",
            data: newSkill
        });
    } catch (error) {
        next(error); 
    }
};

export const updateSkill = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const skillId = parseInt(req.params.id as string);
        const { skillName } = req.body;
        
        if (!skillName) throw new AppError("Vui lòng nhập tên kỹ năng mới!", 400);

        const isUpdated = await skillService.updateSkill(skillId, skillName);
        if (!isUpdated) throw new AppError("Không tìm thấy kỹ năng để cập nhật!", 404);

        return res.status(200).json({
            success: true,
            message: "Cập nhật kỹ năng thành công"
        });
    } catch (error) {
        next(error);
    }
};

export const deleteSkill = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const skillId = parseInt(req.params.id as string);
        const isDeleted = await skillService.deleteSkill(skillId);
        
        if (!isDeleted) throw new AppError("Không tìm thấy kỹ năng để xóa!", 404);

        return res.status(200).json({
            success: true,
            message: "Xóa kỹ năng thành công"
        });
    } catch (error) {
        next(error);
    }
};