import { body, param } from "express-validator";

export const buildResumeValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage("Sếp ơi, CV thì phải có cái tên (title) để mốt dễ phân biệt chứ!"),
    
    body('summary')
        .optional()
        .trim(),

    body('skills')
        .optional()
        .isArray().withMessage("Danh sách kỹ năng phải là một mảng (Array)"),
    
    body('skills.*.skillName')
        .optional()
        .trim()
        .notEmpty().withMessage("Tên kỹ năng không được để trống"),

    body('experience')
        .optional()
        .isArray().withMessage("Kinh nghiệm làm việc phải là một mảng (Array)"),
    
    body('education')
        .optional()
        .isArray().withMessage("Học vấn phải là một mảng (Array)"),

    body('projects')
        .optional()
        .isArray().withMessage("Dự án cá nhân phải là một mảng (Array)")
];

export const generateSummaryValidation = [
    body().custom((value) => {
        if (!value.skills && !value.experience && !value.education) {
            throw new Error("Vui lòng nhập ít nhất Kỹ năng, Kinh nghiệm hoặc Học vấn để AI có dữ liệu viết bài!");
        }
        return true;
    })
];

// Đã đổi tên và sửa logic kiểm tra ID
export const ResumeIdValidation = [
    param('resumeId')
        .notEmpty().withMessage("Sếp quên truyền ID của CV rồi!")
        .isInt({ gt: 0 }).withMessage("Mã CV không hợp lệ (Phải là một số nguyên dương)!")
        .toInt() // Tự động ép kiểu sang số nguyên cho Controller dùng luôn
];