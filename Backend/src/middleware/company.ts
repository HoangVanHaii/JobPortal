import { body, param, query } from "express-validator";

export const RequestCompanyValidation = [
    param('CompanyID')
        .isInt({min: 1}).withMessage("CompanyID phải là số nguyên"),
    body("Position")
        .trim()
        .notEmpty().withMessage('Vị trí không đưdợc để trống'),
]
export const CreateCompanyValidation = [
    body("CompanyName")
        .trim()
        .notEmpty().withMessage('Tên công ty không được để trống'),
    body("TaxCode")
        .trim()
        .matches(/^\d{10}$/).withMessage("TaxCode phải 10 chữ số"),
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
        .notEmpty().withMessage('Thành phố không được để trống'),
    body('BusinessLicenseUrl')
        .custom((value, { req }) => {
            if (!req.files || !(req.files as any).find((f: any) => f.fieldname === 'BusinessLicenseUrl')) {
                throw new Error('Vui lòng upload ảnh Giấy phép kinh doanh');
            }
            return true;
        }),
    body("Position")
        .trim()
        .notEmpty().withMessage('Vị trí không được để trống'),
        
]
export const CompanyIdValidation = [
    param('CompanyID')
        .isInt({min: 1})
        .withMessage("CompanyID phải là số nguyên dương")
]
export const UpdateCompanyStatusValidation = [
    ...CompanyIdValidation,
    query("status")
        .exists()
        .withMessage("status là bắt buộc")
        .bail()
        .isIn(["Pending", "Approved", "Rejected", "Banned"])
        .withMessage("giá trị status không hợp lệ"),
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
    body("TaxCode")
        .optional()
        .trim()
        .matches(/^\d{10}$/).withMessage("TaxCode phải 10 chữ số"),
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
]