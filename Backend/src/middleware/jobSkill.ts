import { body, param } from "express-validator";

export const getJobSkillsValidator = [
    param("jobId")
        .isInt({ min: 1 })
        .withMessage("jobId trên URL phải là số nguyên dương hợp lệ"),
];

export const syncJobSkillsValidator = [
    param("jobId")
        .isInt({ min: 1 })
        .withMessage("jobId trên URL phải là số nguyên dương hợp lệ"),

    body("skillIds")
        .isArray()
        .withMessage("skillIds bắt buộc phải là một mảng (Array)"),
    
    body("skillIds.*")
        .isInt({ min: 1 })
        .withMessage("Tất cả các phần tử bên trong mảng skillIds đều phải là số nguyên dương"),
];

export const removeJobSkillValidator = [
    param("jobId")
        .isInt({ min: 1 })
        .withMessage("jobId trên URL phải là số nguyên dương hợp lệ"),

    param("skillId")
        .isInt({ min: 1 })
        .withMessage("skillId trên URL phải là số nguyên dương hợp lệ"),
];