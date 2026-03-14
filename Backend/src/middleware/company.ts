import { body, param } from "express-validator";


export const CreateCompanyValidation = [
    body("CompanyName")
        .trim()
        .notEmpty().withMessage('Tên công ty không được để trống'),
    body('Industry')
        .notEmpty().withMessage('Ngành nghề là bắt buộc'),
    body('CompanyDescription')
        .trim()
        .optional({checkFalsy: true})
        .isLength({ min: 10 }).withMessage('Mô tả phải từ 10 kí tự trở lên'),
    body('Website')
        .optional({ checkFalsy: true })
        .isURL().withMessage('Website phải là một URL hợp lệ'),
    body('ContactEmail')
        .optional({ checkFalsy: true })
        .isEmail().withMessage('Email không đúng định dạng'),
    body('City')
        .trim()
        .optional({ checkFalsy: true })
        .notEmpty().withMessage('Thành phố không được để trống'),

    body('Address')
        .trim()
        .optional({ checkFalsy: true })
        .notEmpty().withMessage('Địa chỉ cụ thể không được để trống'),
]
export const CompanyIdValidation = [
    param('CompanyID')
        .isInt({min: 1})
        .withMessage("CompanyID phải là số nguyên dương")
]
export const UpdateCompanyStatusValidation = [
    ...CompanyIdValidation,
    body('IsActive')
        .exists()
        .withMessage("Trạng thái IsActive là bắt buộc")
        .isBoolean()
        .withMessage("IsActive phải là kiểu dữ liệu true hoặc false")
]

export const UpdateCompanyValidation = [
    ...CompanyIdValidation,
    body('CompanyName')
        .optional()
        .trim()
        .notEmpty().withMessage("Tên công ty không được để trống"),

    body('CompanyDescription')
        .optional()
        .trim(),

    body('Industry')
        .optional()
        .trim()
        .notEmpty().withMessage("Ngành nghề không được để trống"),

    body('Website')
        .optional()
        .trim()
        .isURL().withMessage("Website phải là một đường dẫn (URL) hợp lệ"),

    body('ContactEmail')
        .optional()
        .trim()
        .isEmail().withMessage("Email liên hệ không đúng định dạng"),

    body('City')
        .optional()
        .trim()
        .notEmpty().withMessage("Thành phố không được để trống"),

    body('Address')
        .optional()
        .trim(),
]