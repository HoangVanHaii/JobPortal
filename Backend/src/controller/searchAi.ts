import { Request, Response, NextFunction } from 'express';
import * as aiSearchService from '../service/searchAi';
import * as jobService from '../service/job';
export const searchJobsAI = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { q } = req.query; 
        if (!q || typeof q !== 'string') {
            return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
        }
        const matchedResults = await aiSearchService.searchJobsByAI(q);

        if (matchedResults.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        const jobIds = matchedResults.map((m: any) => m.jobId);
        const placeholders = jobIds.map(() => '?').join(',');
        const jobs = await jobService.getJobsByIds(jobIds, placeholders);
        // const finalJobs = [];
        // for (const job of jobs) {
        //     const matchData = matchedResults.find((m: any) => m.jobId === job.JobID);
        //     const matchScore = matchData ? Math.round(matchData.score * 100) : 0;

        //     const rowTextForAi = await jobService.getRowTextForAI(job.JobID!);
        //     const contextText = rowTextForAi || `${job.Title} tại ${job.Location}`;

        //     let insight = "Công việc này rất phù hợp với kỹ năng và định hướng của bạn.";
        //     try {
        //         insight = await aiSearchService.generateJobInsights(q, contextText);
        //     } catch (error) {
        //         console.log(`[AI-QUOTA] Bỏ qua tạo nhận xét cho Job ${job.JobID} do quá tải API.`);
        //     }

        //     finalJobs.push({
        //         ...job,
        //         matchScore: matchScore,
        //         aiInsight: insight
        //     });
        // }

        // finalJobs.sort((a, b) => b.matchScore - a.matchScore);
        res.status(200).json({
            success: true,
            data: jobs
        });
    } catch (error) {
        next(error);
    }
};