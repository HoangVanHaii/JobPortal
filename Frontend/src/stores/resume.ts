import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { iResumeDetail } from '../types/resume';
import { CreateResume } from '../services/resume';


export const useResumeStore = defineStore('resume',() => {
    const loading = ref<boolean>(false);
    const message = ref<string>('');
    const error = ref<boolean>(false);
    const errors = ref<Record<string, string>>({});


    const createResumeStore = async (resume: FormData) => {
        try {
            error.value = false;
            loading.value = true;
            message.value = '';
            const data = await CreateResume(resume);
            message.value = data.message || 'Tạo CV thành công';
        } catch (err: any) {
            error.value = true;
            const res = err.response?.data;
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
        createResumeStore
    }

})