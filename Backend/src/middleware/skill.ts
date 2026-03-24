import { body, param } from "express-validator";

export const skillIdValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage("ID kỹ năng phải là một số nguyên dương")
];

export const createSkillValidation = [
    body('skillName')
        .trim()
        .notEmpty().withMessage("Tên kỹ năng không được để trống")
        .isLength({ max: 100 }).withMessage("Tên kỹ năng quá dài, tối đa 100 ký tự thôi sếp ơi!")
];

export const updateSkillValidation = [
    ...skillIdValidation, 
    body('skillName')
        .trim()
        .notEmpty().withMessage("Tên kỹ năng mới không được để trống")
        .isLength({ max: 100 }).withMessage("Tên kỹ năng quá dài, tối đa 100 ký tự")
];