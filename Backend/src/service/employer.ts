import { PoolConnection } from "mysql2/promise";
import { IEmployer } from "../interface/employer";
import { AppError } from "../utils/appError";
import { CheckCompanyId } from "./company";
import pool from "../config/database";

export const createEmployer = async (connection: PoolConnection, employer: IEmployer) => {
    
    const employerExist = await checkEmployerID(connection, employer.EmployerID)
    if (employerExist) {
        throw new AppError("Nhân viên đã tồn tại", 409);
    }

    const query = "INSERT INTO employers (EmployerID, CompanyID, Posit  ion, ApprovalStatus) VALUES (?, ?, ?, ?)";
    const values = [employer.EmployerID, employer.CompanyID, employer.Position, employer.ApprovalStatus];
    await connection.query(query, values);
    return employer.EmployerID;

}
export const checkEmployerID = async (connection: PoolConnection, EmployerID: Number):Promise<boolean> => {
    const query = `SELECT EmployerID FROM Employers WHERE EmployerID = ?`
    const [result]: any = await connection.query(query, [EmployerID]);
    return result.length > 0
}
export const checkEmployerProfile = async (employerID: number) => {
    const query = "SELECT * FROM employers WHERE EmployerID = ?";
    const [rows]: any = await pool.query(query, [employerID]);
    return rows.length > 0 ? rows[0] as IEmployer : null;
}
export const UpdateStatusEmployer = async (EmployerID: number, UserID: number, ApprovalStatus: string) => {
    const query = `
        UPDATE employers e
        JOIN companies c ON e.CompanyID = c.CompanyID
        SET e.ApprovalStatus = ?
        WHERE e.EmployerID = ? 
        AND c.CreatedBy = ?
    `;

    const [result]: any = await pool.query(query, [
        ApprovalStatus,
        EmployerID,
        UserID
    ]);
    if (!result.affectedRows) {
        throw new AppError("Không có quyền hoặc nhân viên không tồn tại", 404);
    }
}
export const getPendingEmployers = async (userId: number) => {

    const query = `
        SELECT 
            e.EmployerID,
            u.Email,
            e.Position,
            e.ApprovalStatus
        FROM employers e
        JOIN companies c ON e.CompanyID = c.CompanyID
        JOIN users u ON u.UserID = e.EmployerID
        WHERE c.CreatedBy = ?
        AND e.ApprovalStatus = 'PENDING'
    `;

    const [rows]: any = await pool.query(query, [userId]);

    return rows;
};

