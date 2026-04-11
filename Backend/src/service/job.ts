import { PoolConnection } from "mysql2/promise";
import pool from "../config/database";
import { IJobPayload, IJob, IJobFilters, IJobDetailPayload, IJobDetail, IInterviewRound } from "../interface/job";
import { JobDetailModel } from "../model/job";
import { generateAndStoreVector } from '../utils/ai';

export const insertJobToMySQL = async (pool: PoolConnection, job: IJobPayload) => {
    const jobQuery = "INSERT INTO jobs (EmployerID, CategoryID, Title, Quantity, SalaryMin, SalaryMax, Location, JobType, ExperienceRequired, ExpiredDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const jobValues = [job.EmployerID, job.CategoryID, job.Title, job.Quantity, job.SalaryMin, job.SalaryMax, job.Location, job.JobType, job.ExperienceRequired, job.ExpiredDate];
    const [jobResult]: any = await pool.query(jobQuery, jobValues);
    return jobResult.insertId;
}
export const insertJobDetailToMongoDB = async (jobDetail: IJobDetailPayload, mysqlJobID: number) => {
    await JobDetailModel.create({
        mysqlJobID: mysqlJobID,
        description: jobDetail.Description,
        requirements: jobDetail.Requirements,
        workingSchedule: jobDetail.WorkingSchedule,
        benefits: jobDetail.Benefits,
        tags: jobDetail.Tags,
        interviewProcess: jobDetail.InterviewProcess,
        rowTextForAi: jobDetail.RawTextForAi
    });
}
export const createJob = async (job: IJobPayload, jobDetail: IJobDetailPayload) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const newMysqlId = await insertJobToMySQL(connection, job);
        await insertJobDetailToMongoDB(jobDetail, newMysqlId);     
       
        if (jobDetail.RawTextForAi) {
            const vectorId = await generateAndStoreVector(jobDetail.RawTextForAi, 'job', newMysqlId);
            await connection.query("UPDATE jobs SET VectorID = ? WHERE JobID = ?", [vectorId, newMysqlId]);
        }

        await connection.commit();
        connection.release();
        return newMysqlId;

    } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
    }
}
export const mergeJob = async(jobIds: number[], rows: any) => {
    const mongoDetails = await JobDetailModel.find({
        mysqlJobID: { $in: jobIds }
    }).select('mysqlJobID description').lean();
    const finalJobList = rows.map((job: any) => {
        const detail = mongoDetails.find((m: any) => m.mysqlJobID === job.JobID)
        return {
            ...job,
            description: detail?.description || ""
        }
    })
    return finalJobList;
}
export const getAllJobs = async (filters: IJobFilters) => {
    const { Page, Limit, CategoryId, Location, MinSalary, MaxSalary } = filters;
    const offset = (Page - 1) * Limit;
    const queryParams: any[] = [];
    
    let query = `SELECT j.JobID, j.Title, j.Location, j.CreatedAt, c.CompanyName, c.LogoUrl AS CompanyLogo 
        FROM jobs j
        JOIN employers e ON j.EmployerID = e.EmployerID
        JOIN companies c ON e.CompanyID = c.CompanyID
        WHERE j.ExpiredDate > NOW()`;
    if (CategoryId) {
        query += " AND j.CategoryID = ?";
        queryParams.push(CategoryId);
    }
    if (Location) {
        query += " AND j.Location LIKE ?";
        queryParams.push(`%${Location}%`);
    }
    if (MinSalary && MaxSalary) {
        query += " AND j.SalaryMin >= ? AND j.SalaryMax <= ?";
        queryParams.push(MinSalary, MaxSalary);
    }
    query += " ORDER BY j.CreatedAt DESC LIMIT ? OFFSET ?";
    queryParams.push(Limit, offset);
    const [rows]: any = await pool.query(query, queryParams);

    const jobIds = rows.map((job: any) => job.JobID)
    const finalJobList = await mergeJob(jobIds, rows)

    return finalJobList as IJob[];
}
export const getJobDetail = async (jobId: number) => {
    const query = `SELECT j.JobID, j.Title, j.Location, j.CreatedAt, j.SalaryMin, j.SalaryMax, j.JobType, c.CompanyName, c.LogoUrl AS CompanyLogo, j.Quantity
        FROM jobs j
        JOIN Employers e ON j.EmployerID = e.EmployerID
        JOIN Companies c ON e.CompanyID = c.CompanyID
        WHERE j.JobID = ?`;

    const [mysqlResult, jobDetailDoc] = await Promise.all([
        pool.query(query, [jobId]),
        JobDetailModel.findOne({ mysqlJobID: jobId }).lean()
    ]);

    const [rows]: any = mysqlResult;

    if (rows.length === 0 || !jobDetailDoc) {
        return null;
    }
    const job: IJob = rows[0];
    const jobDetail: IJobDetail = {
        JobID: job.JobID!,
        Title: job.Title,
        Location: job.Location,
        CreatedAt: job.CreatedAt!,
        CompanyName: job.CompanyName,
        CompanyLogo: job.CompanyLogo,
        Quantity: rows[0].Quantity,
        SalaryMax: rows[0].SalaryMax,
        SalaryMin: rows[0].SalaryMin,
        JobType: rows[0].JobType,
        Description: jobDetailDoc.description,
        WorkingSchedule: jobDetailDoc.workingSchedule || undefined,
        Requirements: jobDetailDoc.requirements,
        Benefits: jobDetailDoc.benefits,
        Tags: jobDetailDoc.tags,
        InterviewProcess: (jobDetailDoc.interviewProcess as unknown as IInterviewRound[]) || undefined
    }
    return jobDetail;
}
export const closeJob = async (jobId: number) => {
    const query = `UPDATE jobs set ExpiredDate = NOW() WHERE JobID = ?`
    await pool.query(query, [jobId]);
    return true;
}
export const updateJob = async (payload: any) => {
    const mysqlSetFields: string[] = [];
    const mysqlValues: any[] = [];

    if (payload.Title !== undefined) {
        mysqlSetFields.push("Title = ?");
        mysqlValues.push(payload.Title);
    }
    if (payload.Location !== undefined) {
        mysqlSetFields.push("Location = ?");
        mysqlValues.push(payload.Location);
    }
    if (payload.SalaryMin !== undefined) {
        mysqlSetFields.push("SalaryMin = ?");
        mysqlValues.push(payload.SalaryMin);
    }
    if (payload.SalaryMax !== undefined) {
        mysqlSetFields.push("SalaryMax = ?");
        mysqlValues.push(payload.SalaryMax);
    }
    if (payload.JobType !== undefined) {
        mysqlSetFields.push("JobType = ?");
        mysqlValues.push(payload.JobType);
    }
    if (payload.Quantity !== undefined) {
        mysqlSetFields.push("Quantity = ?");
        mysqlValues.push(payload.Quantity);
    }

    const currentJobId = payload.JobID || payload.JobId;

    if (mysqlSetFields.length > 0) {
        const mysqlQuery = `UPDATE jobs SET ${mysqlSetFields.join(', ')} WHERE JobID = ?`;
        mysqlValues.push(payload.JobID);

        const [mysqlResult]: any = await pool.query(mysqlQuery, mysqlValues);
        if (mysqlResult.affectedRows === 0) {
            throw new Error("Không tìm thấy công việc để cập nhật!");
        }
    }

    const mongoUpdateData: any = {};

    if (payload.Description !== undefined) mongoUpdateData.description = payload.Description;
    if (payload.WorkingSchedule !== undefined) mongoUpdateData.workingSchedule = payload.WorkingSchedule;
    if (payload.Requirements !== undefined) mongoUpdateData.requirements = payload.Requirements;
    if (payload.Benefits !== undefined) mongoUpdateData.benefits = payload.Benefits;
    if (payload.Tags !== undefined) mongoUpdateData.tags = payload.Tags;
    if (payload.InterviewProcess !== undefined) mongoUpdateData.interviewProcess = payload.InterviewProcess;

    if (Object.keys(mongoUpdateData).length > 0) {
        await JobDetailModel.findOneAndUpdate(
            { mysqlJobID: payload.JobID },
            { $set: mongoUpdateData }
        );
    }

    const titleText = payload.Title || '';
    const descText = payload.Description || '';
    const reqText = payload.Requirements || '';
    const benefitsText = payload.Benefits ? payload.Benefits.join(" ") : '';
    const tagsText = payload.Tags ? payload.Tags.join(" ") : '';
    
    const rawTextForAi = `${titleText} ${descText} ${reqText} ${benefitsText} ${tagsText}`.trim();

    if (rawTextForAi) {
        await generateAndStoreVector(rawTextForAi, 'job', currentJobId);
    }

    return true;
}

export const getJobOfMe = async (page: number, limit: number) => {
    const offset = (page - 1) * limit;
    const queryParams: any[] = [];

    let query = `SELECT j.JobID, j.Title, j.Location, j.CreatedAt, c.CompanyName, c.LogoUrl AS CompanyLogo 
        FROM jobs j
        JOIN employers e ON j.EmployerID = e.EmployerID
        JOIN companies c ON e.CompanyID = c.CompanyID
        ORDER BY j.CreatedAt DESC LIMIT ? OFFSET ?`;

    queryParams.push(limit, offset);
    const [rows]: any = await pool.query(query, queryParams);

    const jobIds = rows.map((job: any) => job.JobID);
    const finalJobList = await mergeJob(jobIds, rows)

    return finalJobList as IJob[];
}
export const isJobOwner = async (employerId: number, jobId: number) => {
    const query = `SELECT EmployerID FROM jobs WHERE JobID = ? AND EmployerID = ?`;
    const value = [employerId, jobId]
    const [rows]: any = await pool.query(query, value);
    return rows.length > 0;
}