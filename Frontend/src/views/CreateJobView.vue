<template>
    <Notify  
        v-if="showNotify" 
        :message="messageNotify" 
        :isSuccess="isSuccessNotify" 
        @close="showNotify = false"
    />
    <Loading 
        v-if="useJob.loading" 
    />
    
    <div class="flex flex-col lg:flex-row h-screen w-full bg-slate-50 font-sans text-slate-800 overflow-hidden">
        
        <SidebarEmployer />

        <div class="flex-1 h-full overflow-y-auto custom-scrollbar relative flex flex-col">
            
            <div class="p-4 sm:p-8 w-full max-w-6xl mx-auto">
                <div class="mb-6 flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-800">Đăng tin tuyển dụng mới</h1>
                        <p class="text-slate-500 text-sm mt-1">Điền chi tiết thông tin công việc để thu hút ứng viên tốt nhất.</p>
                    </div>
                </div>

                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <form @submit.prevent="handleSubmit" class="divide-y divide-slate-100">
                        
                        <div class="p-6 sm:p-8 space-y-6">
                            <h3 class="text-lg font-bold text-blue-700 flex items-center gap-2">
                                <i class="fas fa-info-circle"></i> Thông tin cơ bản
                            </h3>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="md:col-span-2">
                                    <label class="block text-sm font-semibold text-slate-700 mb-2">Tiêu đề công việc <span class="text-red-500">*</span></label>
                                    <input v-model="jobForm.Title" type="text" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" placeholder="VD: Senior Frontend Developer (VueJS)">
                                </div>

                                <div>
                                    <label class="block text-sm font-semibold text-slate-700 mb-2">Danh mục (Ngành nghề) <span class="text-red-500">*</span></label>
                                    <select v-model="jobForm.CategoryID" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm appearance-none">
                                        <option :value="null" disabled>Chọn danh mục</option>
                                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-semibold text-slate-700 mb-2">Địa điểm làm việc <span class="text-red-500">*</span></label>
                                    <input v-model="jobForm.Location" type="text" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" placeholder="VD: Quận 1, TP.HCM">
                                </div>

                                <div>
                                    <label class="block text-sm font-semibold text-slate-700 mb-2">Hình thức làm việc <span class="text-red-500">*</span></label>
                                    <select v-model="jobForm.JobType" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm appearance-none">
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Freelance">Freelance</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-semibold text-slate-700 mb-2">Hạn nộp hồ sơ <span class="text-red-500">*</span></label>
                                    <input v-model="jobForm.ExpiredDate" type="date" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-slate-700">
                                </div>
                            </div>
                        </div>

                        <div class="p-6 sm:p-8 space-y-6">
                            <h3 class="text-lg font-bold text-blue-700 flex items-center gap-2">
                                <i class="fas fa-hand-holding-usd"></i> Yêu cầu chung & Mức lương
                            </h3>

                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <label class="block text-sm font-semibold text-slate-700 mb-2">Số lượng tuyển <span class="text-red-500">*</span></label>
                                    <input v-model="jobForm.Quantity" type="number" min="1" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" placeholder="VD: 5">
                                </div>

                                <div>
                                    <label class="block text-sm font-semibold text-slate-700 mb-2">Kinh nghiệm (Năm)</label>
                                    <input v-model="jobForm.ExperienceRequired" type="number" min="0" step="0.5" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" placeholder="VD: 1.5">
                                </div>

                                <div>
                                    <label class="block text-sm font-semibold text-slate-700 mb-2">Lương Tối Thiểu (VNĐ)</label>
                                    <input v-model="jobForm.SalaryMin" type="number" min="0" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" placeholder="VD: 10000000">
                                </div>

                                <div>
                                    <label class="block text-sm font-semibold text-slate-700 mb-2">Lương Tối Đa (VNĐ)</label>
                                    <input v-model="jobForm.SalaryMax" type="number" min="0" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" placeholder="VD: 25000000">
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">Lịch trình làm việc</label>
                                <input v-model="jobForm.WorkingSchedule" type="text" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" placeholder="VD: Thứ 2 - Thứ 6 (08:30 - 18:00)">
                            </div>
                        </div>

                        <div class="p-6 sm:p-8 space-y-6">
                            <h3 class="text-lg font-bold text-blue-700 flex items-center gap-2">
                                <i class="fas fa-file-alt"></i> Chi tiết công việc
                            </h3>

                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">Mô tả công việc <span class="text-red-500">*</span></label>
                                <textarea v-model="jobForm.Description" rows="4" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm resize-none" placeholder="- Mô tả các nhiệm vụ chính..."></textarea>
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">Yêu cầu ứng viên <span class="text-red-500">*</span></label>
                                <textarea v-model="jobForm.Requirements" rows="4" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm resize-none" placeholder="- Tốt nghiệp chuyên ngành...&#10;- Có kỹ năng..."></textarea>
                            </div>
                        </div>

                        <div class="p-6 sm:p-8 space-y-8">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <div class="flex justify-between items-center mb-3">
                                        <label class="block text-sm font-semibold text-slate-700">Quyền lợi / Phúc lợi</label>
                                        <button type="button" @click="addBenefit" class="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
                                            <i class="fas fa-plus"></i> Thêm
                                        </button>
                                    </div>
                                    <div class="space-y-3">
                                        <div v-for="(benefit, index) in jobForm.Benefits" :key="'ben-'+index" class="flex gap-2">
                                            <input v-model="jobForm.Benefits[index]" type="text" class="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm focus:border-blue-500" placeholder="VD: Thưởng tháng 13...">
                                            <button v-if="jobForm.Benefits.length > 1" type="button" @click="removeBenefit(index)" class="px-3 text-slate-400 hover:text-red-500 transition-colors">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div class="flex justify-between items-center mb-3">
                                        <label class="block text-sm font-semibold text-slate-700">Tags (Phục vụ AI / Tìm kiếm)</label>
                                        <button type="button" @click="addTag" class="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
                                            <i class="fas fa-plus"></i> Thêm Tag
                                        </button>
                                    </div>
                                    <div class="flex flex-wrap gap-2">
                                        <div v-for="(tag, index) in jobForm.Tags" :key="'tag-'+index" class="flex items-center bg-slate-100 border border-slate-200 rounded-full pl-3 pr-1 py-1">
                                            <input v-model="jobForm.Tags[index]" type="text" class="bg-transparent border-none outline-none text-sm w-24 text-slate-700" placeholder="Tag...">
                                            <button type="button" @click="removeTag(index)" class="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                                <i class="fas fa-times text-xs"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="p-6 sm:p-8 space-y-4">
                            <div class="flex justify-between items-center mb-2">
                                <h3 class="text-lg font-bold text-blue-700 flex items-center gap-2">
                                    <i class="fas fa-comments"></i> Quy trình phỏng vấn
                                </h3>
                                <button type="button" @click="addRound" class="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                                    <i class="fas fa-plus-circle"></i> Thêm vòng
                                </button>
                            </div>
                            
                            <div class="space-y-4">
                                <div v-for="(round, index) in jobForm.InterviewProcess" :key="'round-'+index" class="bg-slate-50 border border-slate-200 p-4 rounded-xl flex gap-4 items-start relative group">
                                    <div class="shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                                        {{ index + 1 }}
                                    </div>
                                    <div class="flex-1 space-y-3">
                                        <input v-model="round.RoundTitle" type="text" class="w-full bg-transparent border-b border-slate-300 focus:border-blue-500 outline-none pb-1 font-semibold text-slate-800" placeholder="Tên vòng (VD: Phỏng vấn kỹ thuật)">
                                        <textarea v-model="round.Details" rows="2" class="w-full bg-transparent border-b border-slate-300 focus:border-blue-500 outline-none pb-1 text-sm text-slate-600 resize-none" placeholder="Mô tả chi tiết vòng này..."></textarea>
                                    </div>
                                    <button type="button" @click="removeRound(index)" class="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="p-6 sm:p-8 bg-slate-50 flex items-center justify-between">
                            <p class="text-sm text-slate-500 hidden sm:block"><i class="fas fa-shield-alt mr-1"></i> Tin đăng sẽ được duyệt trước khi hiển thị.</p>
                            <button type="submit" class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-200 flex justify-center items-center gap-2">
                                <i class="fas fa-paper-plane"></i> Xuất bản ngay
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SidebarEmployer from '../components/SidebarEmployer.vue';
import { useJobStore } from '../stores/job';

import Notify from '../components/Notify.vue';
import Loading from '../components/Loading.vue';
import  type{ IInterviewRound, IJobDetailPayload, IJobPayload } from '../types/job';
const showNotify = ref(false);
const messageNotify = ref('');
const isSuccessNotify = ref(true);

// --- CÁC INTERFACE ---


const useJob = useJobStore();
// Mock data Danh mục ngành nghề
const categories = ref([
    { id: 1, name: 'Công nghệ thông tin (IT)' },
    { id: 2, name: 'Marketing / Truyền thông' },
    { id: 3, name: 'Tài chính / Kế toán' },
    { id: 4, name: 'Nhân sự (HR)' },
]);

// --- STATE FORM ---
// Dùng các key viết hoa chữ đầu (PascalCase) để map trực tiếp với Interface
const jobForm = ref({
    CategoryID: null as number | null,
    Title: '',
    Quantity: 1,
    SalaryMin: null as number | null,
    SalaryMax: null as number | null,
    Location: '',
    JobType: 'Full-time',
    ExperienceRequired: 0,
    ExpiredDate: '',
    Description: '',
    Requirements: '',
    WorkingSchedule: '',
    Benefits: [''],
    Tags: [''],
    InterviewProcess: [
        { RoundOrder: 1, RoundTitle: 'Phỏng vấn Nhân sự', Details: 'Trao đổi về văn hóa công ty và định hướng.' }
    ] as IInterviewRound[]
});

// --- CÁC HÀM XỬ LÝ MẢNG ĐỘNG ---

const addBenefit = () => jobForm.value.Benefits.push('');
const removeBenefit = (index: number) => jobForm.value.Benefits.splice(index, 1);

const addTag = () => jobForm.value.Tags.push('');
const removeTag = (index: number) => jobForm.value.Tags.splice(index, 1);

const addRound = () => {
    jobForm.value.InterviewProcess.push({ 
        RoundOrder: jobForm.value.InterviewProcess.length + 1, 
        RoundTitle: '', 
        Details: '' 
    });
};
const removeRound = (index: number) => jobForm.value.InterviewProcess.splice(index, 1);

// --- XỬ LÝ SUBMIT ---
// --- XỬ LÝ SUBMIT TỪ FORM ---
const handleSubmit = async () => {
    // 1. Làm sạch dữ liệu rỗng và đánh lại roundOrder (dùng camelCase luôn)
    const cleanedBenefits = jobForm.value.Benefits.filter(b => b.trim() !== '');
    const cleanedTags = jobForm.value.Tags.filter(t => t.trim() !== '');
    const cleanedProcess = jobForm.value.InterviewProcess
        .filter(p => p.RoundTitle.trim() !== '')
        .map((p, index) => ({
            roundOrder: index + 1,
            roundTitle: p.RoundTitle,
            details: p.Details
        }));

    // Tự động tạo đoạn text thô cho AI
    const rawText = `${jobForm.value.Title} - ${jobForm.value.Description} - ${jobForm.value.Requirements}`;

    // 2. Gom dữ liệu theo đúng chuẩn camelCase mà Backend mong muốn (Giống y hệt cục Test)
    const finalSubmitData = {
        employerId: 1, // Fix cứng tạm hoặc lấy từ biến Auth
        categoryId: Number(jobForm.value.CategoryID),
        title: jobForm.value.Title,
        quantity: Number(jobForm.value.Quantity),
        salaryMin: jobForm.value.SalaryMin ? Number(jobForm.value.SalaryMin) : 0,
        salaryMax: jobForm.value.SalaryMax ? Number(jobForm.value.SalaryMax) : 0,
        location: jobForm.value.Location,
        jobType: jobForm.value.JobType,
        experienceRequired: Number(jobForm.value.ExperienceRequired),
        // Để nguyên chuỗi 'YYYY-MM-DD' hoặc đổi ra chuẩn ISO, tránh gửi Object Date
        expiredDate: new Date(jobForm.value.ExpiredDate).toISOString(), 
        
        description: jobForm.value.Description,
        requirements: jobForm.value.Requirements,
        workingSchedule: jobForm.value.WorkingSchedule,
        benefits: cleanedBenefits,
        tags: cleanedTags,
        interviewProcess: cleanedProcess,
        rawTextForAi: rawText
    };

    console.log('Dữ liệu form chuẩn bị submit:', finalSubmitData);

    // 3. Bắn API
    await useJob.createJobStore(finalSubmitData);

    // 4. Xử lý hiển thị thông báo
    if (useJob.error) {
        showNotify.value = true;
        messageNotify.value = useJob.message || 'Đăng tin thất bại! Vui lòng kiểm tra lại thông tin.';
        isSuccessNotify.value = false;
    } else {
        showNotify.value = true;
        messageNotify.value = useJob.message || 'Đăng tin thành công!';
        isSuccessNotify.value = true;
        
        // Có thể reset lại form ở đây nếu muốn:
        // jobForm.value.Title = '';
        // jobForm.value.Description = ''; 
    }
};


/////////////////////////////////////////////////

// Khai báo biến cho phần Payload Cơ bản (IJobPayload)
const jobPayloadIT: IJobPayload = {
    EmployerID: 1045,
    CategoryID: 1,
    Title: "Senior Backend Developer (Node.js/PostgreSQL)",
    Quantity: 2,
    SalaryMin: 25000000,
    SalaryMax: 40000000,
    Location: "Quận 1, TP. Hồ Chí Minh",
    JobType: "Full-time",
    ExperienceRequired: 3,
    ExpiredDate: new Date("2026-05-30T23:59:59.000Z"),
    VectorID: "vec_tech_node_001"
};

// Khai báo biến cho phần Chi tiết (IJobDetailPayload)
const jobDetailIT: IJobDetailPayload = {
    Description: "Thiết kế, phát triển và bảo trì các API backend hiệu suất cao. Tối ưu hóa database query và tham gia xây dựng kiến trúc Microservices cho hệ thống ERP của công ty.",
    Requirements: "- Tối thiểu 3 năm kinh nghiệm lập trình Node.js.\n- Thành thạo database quan hệ (PostgreSQL) và caching (Redis).\n- Ưu tiên ứng viên có kinh nghiệm với Docker, Kubernetes.",
    WorkingSchedule: "Thứ 2 - Thứ 6 (09:00 - 18:00)",
    Benefits: [
        "Lương tháng 13 + Thưởng hiệu quả dự án",
        "Bảo hiểm sức khỏe toàn diện PTI",
        "Cấp Macbook Pro M3 khi làm việc",
        "Được làm Remote 4 ngày/tháng"
    ],
    Tags: ["Node.js", "Backend", "PostgreSQL", "Microservices"],
    InterviewProcess: [
        {
            RoundOrder: 1,
            RoundTitle: "Phỏng vấn nhân sự (Online)",
            Details: "Trao đổi ngắn 30 phút với HR về định hướng nghề nghiệp, văn hóa công ty và kỳ vọng mức lương."
        },
        {
            RoundOrder: 2,
            RoundTitle: "Phỏng vấn kỹ thuật (Offline)",
            Details: "Phỏng vấn trực tiếp 90 phút với Technical Lead, tập trung vào System Design và giải quyết bài toán thực tế."
        }
    ],
    RawTextForAi: "Senior Backend Developer (Node.js/PostgreSQL) - Thiết kế, phát triển và bảo trì các API backend hiệu suất cao. Tối thiểu 3 năm kinh nghiệm lập trình Node.js. Thành thạo PostgreSQL và Redis."
};

// Gộp lại để test (nếu API của bạn nhận 1 object duy nhất)
const fullITJobSubmitData = { ...jobPayloadIT, ...jobDetailIT };
onMounted(async () => {
    // 1. Dịch data từ PascalCase (Interface) sang camelCase (Backend cần)
    const testPayload = {
        employerId: fullITJobSubmitData.EmployerID,
        categoryId: fullITJobSubmitData.CategoryID,
        title: fullITJobSubmitData.Title,
        quantity: fullITJobSubmitData.Quantity,
        salaryMin: fullITJobSubmitData.SalaryMin,
        salaryMax: fullITJobSubmitData.SalaryMax,
        location: fullITJobSubmitData.Location,
        jobType: fullITJobSubmitData.JobType,
        experienceRequired: fullITJobSubmitData.ExperienceRequired,
        expiredDate: fullITJobSubmitData.ExpiredDate,
        vectorId: fullITJobSubmitData.VectorID,
        
        description: fullITJobSubmitData.Description,
        requirements: fullITJobSubmitData.Requirements,
        workingSchedule: fullITJobSubmitData.WorkingSchedule,
        benefits: fullITJobSubmitData.Benefits,
        tags: fullITJobSubmitData.Tags,
        // Map lại mảng interviewProcess
        interviewProcess: fullITJobSubmitData.InterviewProcess.map(p => ({
            roundOrder: p.RoundOrder,
            roundTitle: p.RoundTitle,
            details: p.Details
        })),
        rawTextForAi: fullITJobSubmitData.RawTextForAi
    };

    console.log("Dữ liệu test chuẩn bị gửi:", testPayload);

    // 2. Bắn API với payload đã được chuẩn hóa
    // await useJob.createJobStore(testPayload);

    // // 3. Xử lý thông báo
    // if(useJob.error) {
    //     showNotify.value = true;
    //     messageNotify.value = useJob.message || 'Đăng tin thất bại!';
    //     isSuccessNotify.value = false;
        
    // } else {
    //     showNotify.value = true;
    //     messageNotify.value = useJob.message || 'Đăng tin thành công!';
    //     isSuccessNotify.value = true;
    // }
});
</script>

<style scoped>
/* Tuỳ chỉnh Date Picker */
input[type="date"]::-webkit-inner-spin-button,
input[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.6;
}
input[type="date"]::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
}

/* Custom Scrollbar */
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 10px;
}
</style>