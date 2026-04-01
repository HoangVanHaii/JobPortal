import { query } from 'express-validator'

export const searchJobsAIValidation = [
    query('q')
        .notEmpty().withMessage('Vui lòng nhập từ khóa tìm kiếm')
        .isString().withMessage('Từ khóa tìm kiếm phải là một chuỗi')
];