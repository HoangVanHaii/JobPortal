import { param } from 'express-validator';

export const jobIdParamValidation = [
    param('jobId')
        .notEmpty()
        .withMessage('Job ID không được để trống')
        .isInt()
        .withMessage('Job ID phải là một số nguyên hợp lệ')
];