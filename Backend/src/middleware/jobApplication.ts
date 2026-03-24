import { body, param } from "express-validator";

export const applyJobValidator = [
    body("JobID")
        .notEmpty()
        .withMessage("JobID là bắt buộc")
        .isInt({ min: 1 })
        .withMessage("JobID phải là số nguyên hợp lệ"),

    body("ResumeID")
        .notEmpty()
        .withMessage("ResumeID là bắt buộc")
        .isInt({ min: 1 })
        .withMessage("ResumeID phải là số nguyên hợp lệ"),
];
export const updateStatusValidator = [

    param("ApplicationID")
        .isInt({ min: 1 })
        .withMessage("ApplicationID không hợp lệ"),

    body("Status")
        .notEmpty()
        .withMessage("Status là bắt buộc")
        .isIn([
            "Pending",
            "Reviewed",
            "Interviewing",
            "Accepted",
            "Rejected",
            "Cancelled"
        ])
        .withMessage("Status không hợp lệ"),
];
export const ApplicationIDValidator = [
    param("ApplicationID")
        .isInt({ min: 1 })
        .withMessage("ApplicationID không hợp lệ"),
]
export const JobIDValidator = [
    param("JobID")
        .isInt({ min: 1 })
        .withMessage("ApplicationID không hợp lệ"),
]