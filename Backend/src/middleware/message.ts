import { param } from 'express-validator';

export const getHistoryValidation = [
    param('otherUserId')
        .notEmpty()
        .withMessage('ID của người chat không được để trống!')
        .isInt()
        .withMessage('ID của người chat phải là một số nguyên hợp lệ!')
];