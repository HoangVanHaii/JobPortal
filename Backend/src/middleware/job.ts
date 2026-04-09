import { body, param } from "express-validator";

export const createJobValidation = [
    body("categoryId").isInt().withMessage("CategoryID phải là một số nguyên"),
    body("title").notEmpty().withMessage("Title không được để trống"),
    body("location").notEmpty().withMessage("Location không được để trống"),
    body("jobType").notEmpty().withMessage("JobType không được để trống"),
    body("experienceRequired").isInt().withMessage("ExperienceRequired phải là một số nguyên"),
    body("expiredDate").isISO8601().withMessage("ExpiredDate phải là một ngày hợp lệ"),

    body("description").notEmpty().withMessage("Description không được để trống"),
    body("requirements").notEmpty().withMessage("Requirements không được để trống"),
    body("benefits").isArray().withMessage("Benefits phải là một mảng").optional(),
    body("tags").isArray().withMessage("Tags phải là một mảng").optional(),
    body("interviewProcess").isArray().withMessage("InterviewProcess phải là một mảng").optional(),
    body("interviewProcess.*.roundOrder").isInt().withMessage("RoundOrder phải là một số nguyên").optional(),
    body("interviewProcess.*.roundTitle").notEmpty().withMessage("RoundTitle không được để trống").optional(),
    body("interviewProcess.*.details").notEmpty().withMessage("Details không được để trống").optional()
];
export const updateJobValidation = [
    body("categoryId").optional().isInt().withMessage("CategoryID phải là một số nguyên"),
    body("title").optional().notEmpty().withMessage("Title không được để trống"),
    body("location").optional().notEmpty().withMessage("Location không được để trống"),
    body("jobType").optional().notEmpty().withMessage("JobType không được để trống"),
    body("experienceRequired").optional().isInt().withMessage("ExperienceRequired phải là một số nguyên"),
    body("expiredDate").optional().isISO8601().withMessage("ExpiredDate phải là một ngày hợp lệ"),

    body("quantity").optional().isInt().withMessage("Quantity phải là một số nguyên"),
    body("salaryMin").optional().isNumeric().withMessage("SalaryMin phải là một số"),
    body("salaryMax").optional().isNumeric().withMessage("SalaryMax phải là một số"),

    body("description").optional().notEmpty().withMessage("Description không được để trống"),
    body("requirements").optional().notEmpty().withMessage("Requirements không được để trống"),
    body("workingSchedule").optional().isString().withMessage("WorkingSchedule phải là định dạng chuỗi"),

    body("benefits").optional().isArray().withMessage("Benefits phải là một mảng"),
    body("tags").optional().isArray().withMessage("Tags phải là một mảng"),

    body("interviewProcess").optional().isArray().withMessage("InterviewProcess phải là một mảng"),
    body("interviewProcess.*.roundOrder").optional().isInt().withMessage("RoundOrder phải là một số nguyên"),
    body("interviewProcess.*.roundTitle").optional().notEmpty().withMessage("RoundTitle không được để trống"),
    body("interviewProcess.*.details").optional().notEmpty().withMessage("Details không được để trống")
];
export const changeStatusJobValidation = [
    body("status").isIn(['Pending', 'Approved', 'Rejected']).withMessage("Status phải là một trong các giá trị: Pending, Approved, Rejected"),
    param("id").isInt().withMessage("Job ID phải là một số nguyên")
];