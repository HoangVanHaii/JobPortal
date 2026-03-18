import { PoolConnection } from "mysql2/promise";import pool from "../config/database";
import { Employer } from "../interface/employer";

export const createEmployer = async (connection: PoolConnection, employer: Employer) => {
    const query = "INSERT INTO employers (EmployerID, CompanyID, Position) VALUES (?, ?, ?)";
    const values = [employer.EmployerID, employer.CompanyID, employer.Position];
    const [result]: any = await connection.query(query, values);
    if (result.affectedRows > 0) {
        return employer.EmployerID;
    }
}