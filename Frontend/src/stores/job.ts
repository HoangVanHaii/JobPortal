import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { IJob, IJobDetail } from '../types/job';
import { getAllCategories, getAllJobs, getJobDetail, getMySavedJobs, isSavedJob, savedJob, searchJobs, unsaveJob } from '../services/job';

export const useJobStore = defineStore('job', () => {
    const jobs = ref<IJob[]>([]);
    const totalPages = ref<number>(1);
    const loading = ref<boolean>(false);
    const error = ref<string>('');
    const listCategoryJobs = ref<{ CategoryID: number; CategoryName: string }[]>([]);
    const listSavedJobs = ref<IJob[]>([]);
    const savedJobsTotalPages = ref<number>(1);
    const jobDetail = ref<IJobDetail | null>(null);
    const listJobSearch = ref<IJob[]>([]);

    const fetchJobs = async (filters: any) => {
        if (filters.minSalary) filters.minSalary *= 1000000;
        if (filters.maxSalary) filters.maxSalary *= 1000000;
        try {
            loading.value = true;
            error.value = '';

            const response = await getAllJobs(filters);

            jobs.value = response.data.items || [];

            if (response.data.totalPages !== undefined) {
                totalPages.value = response.data.totalPages;
            }

            if (jobs.value.length === 0) {
                totalPages.value = 1;
            }

        } catch (err: any) {
            console.error("Lỗi khi lấy danh sách job:", err.response?.data);
            error.value = err.response?.data?.message || 'Đã xảy ra lỗi khi lấy danh sách job';
        } finally {
            loading.value = false;
        }
    };
    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            listCategoryJobs.value = response.data || [];
        } catch (err: any) {
            console.error("Lỗi khi lấy danh sách category:", err.response?.data);
        }
    }
    const fetchJobDetail = async (id: number) => {
        try {
            loading.value = true;
            error.value = '';
            const response = await getJobDetail(id);
            jobDetail.value = response.data || null;
        } catch (err: any) {
            console.error("Lỗi khi lấy chi tiết job:", err.response?.data);
            error.value = err.response?.data?.message || 'Đã xảy ra lỗi khi lấy chi tiết job';
        } finally {
            loading.value = false;
        }
    };
    const fetchJobSearch = async (query: string) => {
        try {
            loading.value = true;
            error.value = '';
            const response = await searchJobs(query);
            listJobSearch.value = response.data || [];
        } catch (err: any) {
            console.error("Lỗi khi tìm kiếm job:", err.response?.data);
            error.value = err.response?.data?.message || 'Đã xảy ra lỗi khi tìm kiếm job';
        } finally {
            loading.value = false;
        }
    }
    const handleSavedJob = async (jobId: number) => {
        try {
            await savedJob(jobId);
            listSavedJobs.value.push(jobs.value.find(j => j.JobID === jobId) as IJob);
        } catch (err: any) {
            console.error("Lỗi khi lưu job:", err.response?.data);
        }
    };
    const handleUnsaveJob = async (jobId: number) => {
        try {
            listSavedJobs.value = listSavedJobs.value.filter(job => job.JobID !== jobId);
            await unsaveJob(jobId);
        } catch (err: any) {
            console.error("Lỗi khi bỏ lưu job:", err.response?.data);
        }
    };
    const fetchMySavedJobs = async (page: number, limit: number) => {
        try {
            loading.value = true;
            error.value = '';
            const response = await getMySavedJobs(page, limit);
            listSavedJobs.value = response.data.items || [];
            savedJobsTotalPages.value = response.data.totalPages || 1;
            if (listSavedJobs.value.length === 0) {
                savedJobsTotalPages.value = 1;
            }   
        } catch (err: any) {
            console.error("Lỗi khi lấy danh sách job đã lưu:", err.response?.data);
            error.value = err.response?.data?.message || 'Đã xảy ra lỗi khi lấy danh sách job đã lưu';
        } finally {
            loading.value = false;
        }
    };
    const checkIsSavedJob = async (jobId: number) => {
        try {
            const isSaved = await isSavedJob(jobId);
            return isSaved.data;
        } catch (error) {
            console.error("Lỗi khi kiểm tra trạng thái lưu job:", error);
            return false;
        }
    }
    return {
        jobs,
        totalPages,
        loading,
        error,
        fetchJobs,
        listCategoryJobs,
        fetchCategories,
        jobDetail,
        fetchJobDetail,
        listJobSearch,
        fetchJobSearch,
        handleSavedJob,
        handleUnsaveJob,
        listSavedJobs,
        savedJobsTotalPages,
        fetchMySavedJobs,
        checkIsSavedJob
    }
});