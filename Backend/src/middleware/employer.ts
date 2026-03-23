import { body, param } from "express-validator";

export const updateStatus = [
    param("EmployerID")
        .isInt({ min: 1 }).withMessage("EmployerID là bắt buộc"),
    body("ApprovalStatus")
        .notEmpty().withMessage("Vui lòng truyền trạng thái")
        .isIn(["Pending", "Approved", "Rejected"]).withMessage("ApprovalStatus không hợp lệ")
]
