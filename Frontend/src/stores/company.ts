import { ref } from 'vue';
import { defineStore } from 'pinia';
import { CreateCompany, GetAllCompany, requestCompany } from '../services/company';
import type { ICompanyResponse } from '../types/company';

export const useCompanyStore = defineStore('company',() => {
    const loading = ref<boolean>(false);
    const message = ref<string>('');
    const error = ref<boolean>(false);
    const listCompany = ref<ICompanyResponse[]>([]);
    

    const createCompanyStore = async (formData: FormData) => {
        try {
            error.value = false;
            loading.value = true;
            message.value = '';
            const data = await CreateCompany(formData);
            message.value = data.message || 'Tạo công ty thành công';
        } catch (err: any) {
            error.value = true;
            console.error("Lỗi khi tạo công ty:", err.response?.data);
            message.value = err.response?.data?.message || 'Đã xảy ra lỗi khi tạo công ty';
        } finally {
            loading.value = false;
        }

    }
    const getAllCompanyStore = async () => {
        try {
            error.value = false;
            loading.value = true;
            message.value = '';
            const data = await GetAllCompany();
            listCompany.value = data.data || [];
            message.value = data.message || 'Lấy danh sách công ty thành công';
        } catch (err: any) {
            error.value = true;
            console.error("Lỗi khi lấy danh sách công ty:", err.response?.data);
            message.value = err.response?.data?.message || 'Đã xảy ra lỗi khi lấy danh sách công ty';
        } finally {
            loading.value = false;
        }
    }
    const requestCompanyStore = async (companyID: number, Position: string) => {
        try {
            error.value = false;
            loading.value = true;
            message.value = '';
            const data = await requestCompany(companyID, Position);
            message.value = data.message || 'Gửi yêu cầu thành công';
        } catch (err: any) {
            error.value = true;
            console.error("Lỗi khi gửi yêu cầu:", err.response?.data);
            message.value = err.response?.data?.message || 'Đã xảy ra lỗi khi gửi yêu cầu';
        } finally {
            loading.value = false;
        }
    }

    return {
        loading,
        message,
        error,
        listCompany,
        createCompanyStore,
        getAllCompanyStore,
        requestCompanyStore
    }

})