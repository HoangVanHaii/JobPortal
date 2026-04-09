import { Request, Response, NextFunction } from "express";
import *as jobService from "../service/job";
import *as employerService from "../service/employer";
import redisClient from "../config/redisClient";
import { IJobPayload, IJobDetailPayload, IJobFilters } from "../interface/job";
import { AppError } from "../utils/appError";

export const getAllJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters: IJobFilters = {
            Page: parseInt(req.query.page as string) || 1,
            Limit: parseInt(req.query.limit as string) || 10,
            CategoryId: req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined,
            Location: req.query.location as string,
            MinSalary: req.query.minSalary ? parseInt(req.query.minSalary as string) : undefined,
            MaxSalary: req.query.maxSalary ? parseInt(req.query.maxSalary as string) : undefined,
        };
        const cacheKey = `jobs_list:p${filters.Page}:l${filters.Limit}:c${filters.CategoryId || 'all'}:loc_${filters.Location || 'all'}:min${filters.MinSalary || 'all'}:max${filters.MaxSalary || 'all'}`;
        const cachedJobs = await redisClient.get(cacheKey);
        if (cachedJobs) {
            console.log("Lấy dữ liệu từ Redis cache");
            return res.status(200).json({
                success: true,
                message: "Lấy tất cả job thành công",
                data: JSON.parse(cachedJobs)
            });
        }
        const jobs = await jobService.getAllJobs(filters);
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(jobs));
        res.status(200).json({
            success: true,
            message: "Lấy tất cả job thành công",
            data: jobs
        });
    } catch (error) {
        next(error);
    }
}
export const getRecommendedJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const candidateId = req.user!.id;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const jobs = await jobService.getRecommendedJobs(
            candidateId,
            page,
            limit
        );

        return res.json({
            success: true,
            message: "Lấy danh sách công việc được đề xuất thành công",
            data: jobs
        });

    } catch (error) {
        next(error);
    }
};
export const getJobDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jobId = Number(req.params.id);
        const cacheKey = `job_detail:${jobId}`;
        const cachedJobDetail = await redisClient.get(cacheKey);
        if (cachedJobDetail) {
            console.log("Lấy dữ liệu chi tiết công việc từ Redis cache");
            return res.status(200).json({
                success: true,
                message: "Lấy chi tiết công việc thành công",
                data: JSON.parse(cachedJobDetail)
            });
        }
        const jobDetail = await jobService.getJobDetail(jobId);
        if (!jobDetail) {
            throw new AppError("Không tìm thấy công việc", 404);
        }
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(jobDetail));
        res.status(200).json({
            success: true,
            message: "Lấy công việc chi tiết thành công",
            data: jobDetail
        });
    } catch (error) {
        next(error);
    }
}
const clearJobsListCache = async () => {
    try {
        const keys = await redisClient.keys("*jobs_list*");
        if (keys.length > 0) {
            await redisClient.unlink(keys);
            console.log(`Đã xóa ${keys.length} cache lists`);
        }
    } catch (err) {
        console.error("Lỗi khi xóa cache list:", err);
    }
};
export const createJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { categoryId, title, quantity, salaryMin, salaryMax, location, jobType, experienceRequired, expiredDate,
            description, requirements, workingSchedule, benefits, tags, interviewProcess
        } = req.body;
        
        const employerID = Number(req.user!.id);
        const employerProfile = await employerService.checkEmployerProfile(employerID);

        if (!employerProfile) {
            throw new AppError('Vui lòng tạo hồ sơ nhà tuyển dụng trước khi đăng tuyển', 400)
        }
        if (employerProfile.ApprovalStatus !== "Approved") {
            throw new AppError('Hồ sơ nhà tuyển dụng của bạn đang chờ duyệt hoặc đã bị từ chối', 403);
        }
        const jobPayload: IJobPayload = {
            EmployerID: employerID,
            CategoryID: categoryId,
            Title: title,
            Quantity: quantity || 1,
            SalaryMin: salaryMin,
            SalaryMax: salaryMax,
            Location: location,
            JobType: jobType,
            ExperienceRequired: experienceRequired,
            ExpiredDate: expiredDate
        }
        const rawTextForAi = `
            Chức danh công việc: ${title}.
            Địa điểm làm việc: ${location}.
            Hình thức làm việc: ${jobType}.
            Yêu cầu số năm kinh nghiệm: ${experienceRequired} năm.
            Từ khóa kỹ năng (Tags): ${tags.join(", ")}.
            Mô tả chi tiết: ${description}.
            Yêu cầu chuyên môn: ${requirements}.
            Phúc lợi và quyền lợi: ${benefits.join(", ")}.
        `.replace(/\s+/g, ' ').trim();
        const jobDetailPayload: IJobDetailPayload = {
            Description: description,
            Requirements: requirements,
            WorkingSchedule: workingSchedule,
            Benefits: benefits,
            Tags: tags,
            InterviewProcess: interviewProcess,
            RawTextForAi: rawTextForAi
        };

        const jobId = await jobService.createJob(jobPayload, jobDetailPayload);
        jobService.processJobVector(jobId, jobDetailPayload.RawTextForAi).catch(err => {
            console.error(`[AI-BACKGROUND] Lỗi khi nạp Vector cho Job ID: ${jobId}`, err);
        });
        res.status(201).json({ 
            success: true,
            message: "Tạo công việc thành công",
            data: jobId
        });
        

    } catch (error) {
        next(error);
    }
}
export const closeJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employerId = parseInt(req.user!.id.toString());
        const jobId = Number(req.params.id);
        const isOwner = await jobService.isJobOwner(employerId, jobId);
        if (!isOwner) {
            throw new AppError('Bạn không phải là người tạo là công việc này', 403)
        }
        await jobService.closeJob(jobId);
        const cacheKey = `job_detail:${jobId}`;
        await redisClient.del(cacheKey);
        await clearJobsListCache();
        res.status(200).json({
            success: true,
            message: "Ẩn khỏi danh sách thành công"
        });
    } catch (error) {
        next(error);
    }
}
export const updateJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jobId = Number(req.params.id);
        const employerId = parseInt(req.user!.id.toString());
        const isOwner = await jobService.isJobOwner(employerId, jobId);
        if (!isOwner) {
            throw new AppError('Bạn không phải là người tạo là công việc này', 403)
        }
        const isPending = await jobService.isJobPending(jobId);
        if (!isPending) {
            throw new AppError('Chỉ được phép chỉnh sửa công việc đang ở trạng thái chờ duyệt', 400)
        }
        const { title, location, salaryMin, salaryMax, jobType, quantity, description, workingSchedule, requirements, benefits, tags, interviewProcess } = req.body;

        const updatePayload = {
            JobId:jobId,
            Title: title,
            Location: location,
            SalaryMin: salaryMin,
            SalaryMax: salaryMax,
            JobType: jobType,
            Quantity: quantity,
            Description: description,
            WorkingSchedule: workingSchedule,
            Requirements: requirements,
            Benefits: benefits,
            Tags: tags,
            InterviewProcess: interviewProcess
        } ;

        await jobService.updateJob(updatePayload);
        const cacheKey = `job_detail:${jobId}`;
        await redisClient.del(cacheKey);
        await clearJobsListCache();
        res.status(200).json({
            success: true,
            message: "Cập nhật công việc thành công",
            data: jobId
        });

    } catch (error) {
        next(error);
    }
}

export const getJobOfMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        
        const employerID = req.user!.id;
        const cacheKey = `employer_jobs_list:u${employerID}:p${page}:l${limit}`;

        const cachedJobs = await redisClient.get(cacheKey);
        if (cachedJobs) {
            console.log("Lấy dữ liệu từ Redis cache");
            return res.status(200).json({
                success: true,
                message: "Lấy công việc của bạn thành công",
                data: JSON.parse(cachedJobs)
            });
        }
        const jobs = await jobService.getJobOfMe(page, limit);
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(jobs));
        res.status(200).json({
            success: true,
            message: "Lấy công việc của bạn thành công",
            data: jobs
        });
    } catch (error) {
        next(error);
    }
}

export const changeStatusJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jobId = parseInt(req.params.id.toString());
        // const adminId = parseInt(req.user!.id.toString());
        const { status } = req.body;
        await jobService.changeStatusJob(jobId, status);
        await clearJobsListCache();
        res.status(200).json({
            success: true,
            message: "Thay đổi trạng thái công việc thành công"
        });
    } catch (error) {
        next(error);
    }
}