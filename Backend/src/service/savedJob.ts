import pool from "../config/database";
import { mergeJob } from "./job";

export const isSavedJob = async (userId: number, jobId: number): Promise<boolean> => {
    const query = "SELECT 1 FROM savedJobs WHERE userId = ? AND jobId = ? LIMIT 1";
    const [rows]: any = await pool.query(query, [userId, jobId]);
    return rows.length > 0;
}

export const savedJob = async (userId: number, jobId: number) => {
    const query = "INSERT INTO savedJobs (userId, jobId) VALUES (?, ?)";
    const [result] = await pool.query(query, [userId, jobId]);
    return result;
}

export const removeSavedJob = async (userId: number, jobId: number) => {
    const query = "DELETE FROM savedJobs WHERE userId = ? AND jobId = ?";
    const [result] = await pool.query(query, [userId, jobId]);
    return result;
}
export const getSavedJobs = async (userId: number, page: number, limit: number) => {
    const offset = (page - 1) * limit;
    const query = `
        SELECT 
            j.JobID, j.Title, j.Location, j.CreatedAt, j.SalaryMin, j.SalaryMax,
            c.CompanyName, c.LogoUrl AS CompanyLogo,
            sj.createdAt AS SavedAt 
        FROM savedJobs sj
        JOIN jobs j ON sj.jobId = j.JobID
        JOIN employers e ON j.EmployerID = e.EmployerID
        JOIN companies c ON e.CompanyID = c.CompanyID
        WHERE sj.userId = ?
        ORDER BY sj.createdAt DESC
        LIMIT ? OFFSET ?
    `;
    const values = [userId, limit, offset];
    const [rows]: any = await pool.query(query, values);
    if (rows.length === 0) return [];
    const jobIds = rows.map((job: any) => job.JobID);
    const finalJobList = await mergeJob(jobIds, rows);

    return finalJobList;
}