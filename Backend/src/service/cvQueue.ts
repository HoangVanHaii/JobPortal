import { analyzeApplicationWithAI } from "./jobApplycation";

interface QueueItem {
    ApplicationID: number;
    JobID: number;
    ResumeID: number;
}
const queue: QueueItem[] = [];
let isProcessing = false;
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const processQueue = async () => {
    if (isProcessing) return;
    isProcessing = true;
    while (queue.length > 0) {
        const currentJob = queue[0];
        if (currentJob) {
            try {
                await analyzeApplicationWithAI(currentJob.ApplicationID, currentJob.JobID, currentJob.ResumeID);
                queue.shift();
                await sleep(3000);
            } catch (error: any) {
                if (error.status === 429) {
                    console.log('Queue quá giới hạn API (429). Tạm dừng 30s');
                    await sleep(30000);
                }
                else {
                    console.error(`[Queue] Lỗi khi chấm ApplicationID ${currentJob.ApplicationID}:`, error);
                    queue.shift();
                }
            }
        }
    }
    isProcessing = false;
}
export const addJobToQueue = (ApplicationID: number, JobID: number, ResumeID: number) => {
    queue.push({ ApplicationID, JobID, ResumeID });
    processQueue();
}