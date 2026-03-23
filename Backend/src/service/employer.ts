import pool from "../config/database";
import { IEmployer } from "../interface/employer";

export const createEmployer = async (employer: IEmployer) => {
    const query = "INSERT INTO employers (EmployerID, CompanyID, Position) VALUES (?, ?, ?)";
    const values = [employer.EmployerID, employer.CompanyID, employer.Position];
    const [result]: any = await pool.query(query, values);
    return result.insertId;
}

export const checkEmployerProfile = async (employerID: number) => {
    const query = "SELECT * FROM employers WHERE EmployerID = ?";
    const [rows]: any = await pool.query(query, [employerID]);
    return rows.length > 0 ? rows[0] as IEmployer : null;
}
