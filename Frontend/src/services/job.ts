import api from "./api";

export const createJob = async (jobData: any) => {
    const response = await api.post('/jobs/create-job', jobData);
    return response.data;
}
export const getJobOfMe = async (page: number = 1, limit: number = 6) => {
    const response = await api.get('/jobs/job-of-me', {
        params: { page, limit }
    });
    return response.data;
}
export const getJobDetail = async (jobID: number) => {
    const response = await api.get(`/jobs/${jobID}`);
    return response.data;
}
export const deleteJob = async (jobID: number) => {
    const response = await api.delete(`/jobs/soft-delete-job/${jobID}`);
    return response.data;
}