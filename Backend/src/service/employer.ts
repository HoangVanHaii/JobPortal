import pool from "../config/database";
import { Employer } from "../interface/employer";

export const createEmployer = async (employer: Employer) => {
    const query = "INSERT INTO employers (EmployerID, CompanyID, Position) VALUES (?, ?, ?)";
    const values = [employer.EmployerID, employer.CompanyID, employer.Position];
    const [result]: any = await pool.query(query, values);
    if (result.affectedRows > 0) {
        return employer.EmployerID;
    }
}