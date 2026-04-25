import { ref } from 'vue';
import { defineStore } from 'pinia';
import { createJob, deleteJob, getJobDetail, getJobOfMe } from '../services/job';
import type{ IListJob } from '../types/job';


export const useJobStore = defineStore('job',() => {
    const loading = ref<boolean>(false);
    const message = ref<string>('');
    const error = ref<boolean>(false);
    const errors = ref<Record<string, string>>({});
    const listJobMe = ref<IListJob[]>([]);
    const hasNextPage = ref(false);

    const createJobStore = async (job: any) => {
        try {
            error.value = false;
            loading.value = true;
            message.value = '';
            const data = await createJob(job);
            message.value = data.message || 'Tạo công việc thành công';
        } catch (err: any) {
            error.value = true;
            const res = err.response?.data;
            console.error('Error response from createJob:', res);
            if (res?.errors && Array.isArray(res.errors)) {
                const map: Record<string, string> = {};
                res.errors.forEach((e: any) => {
                    map[e.path] = e.msg;
                });
                errors.value = map;
                message.value = res.errors[0]?.msg;
            }
            else {
                message.value = res?.message || 'Đã xảy ra lỗi';
            }
        } finally {
            loading.value = false;
        }

    }
    const getJobOfMeStore = async (page: number = 1, limit: number = 6) => {
        try {
            error.value = false;
            loading.value = true;
            message.value = '';
            const data = await getJobOfMe(page, limit);
            const jobs = data.data || [];
            if (page > 1 && jobs.length === 0) {
                hasNextPage.value = false;
                message.value = 'Không còn công việc nào nữa';
                console.error('No more jobs to fetch for getJobOfMe');
                return false;
            }
            listJobMe.value = jobs || [];
            message.value = data.message || 'Lấy công việc thành công';
            hasNextPage.value = data.data.length === limit;
            return true;
        } catch (err: any) {
            error.value = true;
            const res = err.response?.data;
            console.error('Error response from getJobOfMe:', res);
            if (res?.errors && Array.isArray(res.errors)) {
                const map: Record<string, string> = {};
                res.errors.forEach((e: any) => {
                    map[e.path] = e.msg;
                });
                errors.value = map;
                message.value = res.errors[0]?.msg;
            }
            else {
                message.value = res?.message || 'Đã xảy ra lỗi';
            }
            return false;
        } finally {
            loading.value = false;
        }
    }
    const getJobDetailStore = async (jobID: number) => {
        try {
            error.value = false;
            loading.value = true;
            message.value = '';
            const data = await getJobDetail(jobID);
            message.value = data.message || 'Lấy công việc thành công';
            return data.data || null;
        } catch (err: any) {
            error.value = true;
            const res = err.response?.data;
            console.error('Error response from getJobDetail:', res);
            if (res?.errors && Array.isArray(res.errors)) {
                const map: Record<string, string> = {};
                res.errors.forEach((e: any) => {
                    map[e.path] = e.msg;
                });
                errors.value = map;
                message.value = res.errors[0]?.msg;
            }
            else {
                message.value = res?.message || 'Đã xảy ra lỗi';
            }
        } finally {
            loading.value = false;
        }
    }
    const deleteJobStore = async (jobID: number) => {
        try {
            error.value = false;
            loading.value = true;
            message.value = '';
            const data = await deleteJob(jobID);
            message.value = data.message || 'Xóa công việc thành công';
        } catch (err: any) {
            error.value = true;
            const res = err.response?.data;
            console.error('Error response from deleteJob:', res);
            if (res?.errors && Array.isArray(res.errors)) {
                const map: Record<string, string> = {};
                res.errors.forEach((e: any) => {
                    map[e.path] = e.msg;
                });
                errors.value = map;
                message.value = res.errors[0]?.msg;
            }
            else {
                message.value = res?.message || 'Đã xảy ra lỗi';
            }
        } finally {
            loading.value = false;
        }
    }

    return {
        loading,
        message,
        error,
        listJobMe,
        hasNextPage,
        createJobStore,
        getJobOfMeStore,
        getJobDetailStore,
        deleteJobStore
    }

})