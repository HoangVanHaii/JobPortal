import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { iResumeDetail } from '../types/resume';
import { CreateResume } from '../services/resume';


export const useResumeStore = defineStore('resume',() => {
    const loading = ref<boolean>(false);
    const message = ref<string>('');
    const error = ref<boolean>(false);
    

    const createResumeStore = async (resume: iResumeDetail) => {
        try {
            error.value = false;
            loading.value = true;
            message.value = '';
            const data = await CreateResume(resume);
            message.value = data.message || 'Tạo CV thành công';
        } catch (err: any) {
            error.value = true;
            console.error("Lỗi khi tạo cv:", err.response?.data);
            message.value = err.response?.data?.message || 'Đã xảy ra lỗi khi tạo cv';
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