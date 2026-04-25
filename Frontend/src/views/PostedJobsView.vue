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
    <JobDetail 
        :isOpen="isDetailModalOpen" 
        :jobId="selectedJobId" 
        @close="isDetailModalOpen = false" 
    />
    <EditJonDetail 
        :isOpen="isEditModalOpen" 
        :jobId="selectedEditJobId" 
        @close="isEditModalOpen = false" 
        @save=""
    />
    
    <div class="flex flex-col lg:flex-row h-screen w-full bg-[#F1F5F9] font-sans text-slate-800 overflow-hidden">
        
        <SidebarEmployer />

        <div class="flex-1 h-full overflow-y-auto custom-scrollbar relative flex flex-col">
            <div class="p-4 sm:p-8 max-w-7xl mx-auto w-full">
                
                <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Quản lý tin đăng</h1>
                        <p class="text-sm text-slate-500 mt-1">Quản lý danh sách các tin tuyển dụng và trạng thái phê duyệt.</p>
                    </div>
                    
                    <button @click="router.push({ path: '/create-job' })" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm shadow-blue-200 transition-all flex items-center gap-2 w-fit">
                        <i class="fas fa-plus"></i> Đăng tin mới
                    </button>
                </div>

                <div class="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 p-2 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-20 mt-6 mb-6">
                    
                    <div class="flex space-x-1 overflow-x-auto w-full sm:w-auto hide-scrollbar p-1 z-30">
                        <button 
                            v-for="tab in tabs" 
                            :key="tab.value"
                            @click="handleTabChange(tab.value)"
                            :class="[
                                'whitespace-nowrap font-semibold text-sm px-5 py-2 rounded-xl transition-all duration-300 flex items-center gap-2',
                                currentTab === tab.value 
                                    ? 'bg-slate-900 text-white shadow-md' 
                                    : 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                            ]"
                        >
                            {{ tab.label }}
                            <span v-if="currentTab === tab.value" class="px-1.5 py-0.5 rounded-md bg-white/20 text-xs font-bold">{{ sortedAndFilteredJobs.length }}</span>
                        </button>
                    </div>

                    <div class="shrink-0 px-2 sm:px-4 w-full sm:w-auto flex justify-end">
                        <div class="relative w-full sm:w-48 z-30">
                            <button 
                                @click="isSortOpen = !isSortOpen" 
                                class="w-full flex items-center justify-between gap-2 pl-4 pr-3 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-sm font-medium text-slate-700 transition-all focus:ring-2 focus:ring-blue-100 outline-none"
                            >
                                <span class="flex items-center gap-2">
                                    <i class="fas fa-sort-amount-down text-slate-400"></i>
                                    {{ currentSortLabel }}
                                </span>
                                <i class="fas fa-chevron-down text-xs text-slate-400 transition-transform duration-300" :class="{'rotate-180': isSortOpen}"></i>
                            </button>

                            <transition 
                                enter-active-class="transition ease-out duration-200" 
                                enter-from-class="transform opacity-0 scale-95 -translate-y-2" 
                                enter-to-class="transform opacity-100 scale-100 translate-y-0" 
                                leave-active-class="transition ease-in duration-150" 
                                leave-from-class="transform opacity-100 scale-100 translate-y-0" 
                                leave-to-class="transform opacity-0 scale-95 -translate-y-2"
                            >
                                <div v-if="isSortOpen" class="absolute right-0 mt-2 w-full sm:w-56 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-50 origin-top-right overflow-hidden">
                                    <div class="px-3 pb-2 mb-2 border-b border-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        Tiêu chí sắp xếp
                                    </div>
                                    <button 
                                        v-for="option in sortOptions" 
                                        :key="option.value" 
                                        @click="selectSort(option)" 
                                        class="w-full text-left px-4 py-2.5 text-sm flex items-center justify-between group transition-colors"
                                        :class="currentSort === option.value ? 'bg-blue-50/50' : 'hover:bg-slate-50'"
                                    >
                                        <span :class="currentSort === option.value ? 'text-blue-700 font-bold' : 'text-slate-600 font-medium group-hover:text-slate-900'">
                                            {{ option.label }}
                                        </span>
                                        <i v-if="currentSort === option.value" class="fas fa-check text-blue-600 text-xs"></i>
                                    </button>
                                </div>
                            </transition>

                            <div v-if="isSortOpen" @click="isSortOpen = false" class="fixed inset-0 z-40 cursor-default"></div>
                        </div>
                    </div>
                </div>

                <div class="space-y-4 relative z-10">
                    <div @click="openJobDetail(job.JobID || null)" v-for="job in paginatedJobs" :key="job.JobID" 
                        class="group bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 relative overflow-hidden cursor-pointer">
                        
                        <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity" 
                            :class="getStatusLineColor(job.Status)"></div>

                        <div class="flex flex-row sm:flex-col sm:items-center gap-3 sm:gap-4 sm:w-28 shrink-0 relative z-10">
                            <div class="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50 p-2 shadow-sm flex items-center justify-center shrink-0">
                                <img v-if="job.CompanyLogo" :src="job.CompanyLogo" alt="Logo" class="w-full h-full object-contain">
                                <i v-else class="fas fa-building text-slate-300 text-xl sm:text-2xl"></i>
                            </div>
                            
                            <div class="flex flex-col justify-center sm:hidden flex-1">
                                <h3 class="text-[15px] font-bold text-slate-800 line-clamp-2 leading-tight">{{ job.Title }}</h3>
                                <div class="mt-1.5">
                                    <span class="text-[10px] px-2 py-0.5 rounded-full" :class="getStatusBadgeClass(job.Status)">
                                        {{ getStatusLabel(job.Status) }}
                                    </span>
                                </div>
                            </div>

                            <div class="hidden sm:block w-full text-center mt-[-4px]">
                                <span class="text-[11px] px-2 py-1 rounded-md" :class="getStatusBadgeClass(job.Status)">
                                    {{ getStatusLabel(job.Status) }}
                                </span>
                            </div>
                        </div>

                        <div class="flex-1 flex flex-col justify-between relative z-10">
                            <div>
                                <h3 class="hidden sm:block text-[17px] font-bold text-slate-800 group-hover:text-blue-700 transition-colors mb-2 leading-tight">
                                    {{ job.Title }}
                                </h3>
                                
                                <div class="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-[13px] text-slate-500 font-medium">
                                    <div class="flex items-center gap-1.5 text-slate-700 font-semibold">
                                        <i class="fas fa-briefcase text-slate-400 text-xs w-3"></i>
                                        <span class="truncate">{{ job.CompanyName || 'Công ty ẩn danh' }}</span>
                                    </div>
                                    <div class="flex items-center gap-1.5">
                                        <i class="fas fa-map-marker-alt text-slate-400 text-xs w-3"></i>
                                        <span>{{ job.Location }}</span>
                                    </div>
                                    <div class="flex items-center gap-1.5">
                                        <i class="fas fa-clock text-slate-400 text-xs w-3"></i>
                                        <span>{{ formatDate(job.CreatedAt) }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-100 border-dashed">
                                <div class="flex items-center gap-4 w-full sm:w-auto">
                                    <div class="flex items-center gap-2">
                                        <div class="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                            <i class="fas fa-eye text-[10px]"></i>
                                        </div>
                                        <div class="leading-tight">
                                            <div class="text-[13px] font-bold text-slate-700">{{ job.JobID ? jobStats[job.JobID] || 0 : 0 }}</div>
                                            <div class="text-[10px] text-slate-400 uppercase tracking-wide">Lượt xem</div>
                                        </div>
                                    </div>
                                    <div class="w-px h-6 bg-slate-200"></div>
                                    <div class="flex items-center gap-2">
                                        <div class="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                            <i class="fas fa-user-check text-[10px]"></i>
                                        </div>
                                        <div class="leading-tight">
                                            <div class="text-[13px] font-bold text-slate-700">{{ job.ApplicationCount || 0 }}</div>
                                            <div class="text-[10px] text-slate-400 uppercase tracking-wide">Ứng tuyển</div>
                                        </div>
                                    </div>
                                </div>

                                <div @click.stop class="flex flex-row items-center gap-2 w-full sm:w-auto">
                                    <button v-if="job.Status === 'Pending'" @click="openEditModal(job.JobID || null)" 
                                        class="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                                        <i class="fas fa-pen"></i> Chỉnh sửa
                                    </button>
                                    
                                    <button @click="openDeleteModal(job.JobID || null)" 
                                        class="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all">
                                        <i class="fas fa-trash-alt"></i> Xóa bỏ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="paginatedJobs.length === 0" class="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-slate-200 border-dashed">
                        <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                            <i class="fas fa-folder-open text-2xl"></i>
                        </div>
                        <h3 class="text-lg font-bold text-slate-700">Không tìm thấy tin đăng</h3>
                        <p class="text-slate-500 text-sm mt-1">Hãy thử thay đổi bộ lọc hoặc tạo tin tuyển dụng mới.</p>
                    </div>
                </div>

                <div v-if="totalPages > 1" class="flex justify-center items-center gap-1.5 py-4 mt-4">
                    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                        class="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors">
                        <i class="fas fa-chevron-left text-xs"></i>
                    </button>
                    
                    <button v-for="page in totalPages" :key="page" @click="changePage(page)"
                        :class="[
                            'w-9 h-9 flex items-center justify-center rounded-xl font-bold transition-all',
                            currentPage === page ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        ]"
                    >
                        {{ page }}
                    </button>
                    
                    <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                        class="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors">
                        <i class="fas fa-chevron-right text-xs"></i>
                    </button>
                </div>

            </div>
        </div>
    </div>

    <Teleport to="body">
        <transition name="modal-fade">
            <div 
                v-if="isDeleteModalOpen" 
                @click.self="closeDeleteModal" 
                class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6"
            >
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up">
                    <div class="p-6 sm:p-8 text-center">
                        <div class="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl shadow-sm border border-red-200">
                            <i class="fas fa-trash-alt"></i>
                        </div>
                        <h3 class="text-xl font-extrabold text-slate-800 mb-2">Xác nhận xóa</h3>
                        <p class="text-slate-500 text-sm leading-relaxed">
                            Bạn có chắc chắn muốn xóa tin tuyển dụng này không? <br>
                            Hành động này <span class="font-semibold text-slate-700">không thể hoàn tác</span>.
                        </p>
                    </div>
                    
                    <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-3">
                        <button @click="closeDeleteModal" class="flex-1 px-4 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors text-sm">
                            Hủy bỏ
                        </button>
                        <button @click="handleConfirmDelete" class="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm shadow-red-200 transition-colors text-sm">
                            Xóa ngay
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'; // Đã import thêm onMounted
import SidebarEmployer from '../components/SidebarEmployer.vue';
import Notify from '../components/Notify.vue';
import Loading from '../components/Loading.vue';
import { useJobStore } from '../stores/job';
import type { IListJob } from '../types/job';
import { useRouter } from 'vue-router';
import JobDetail from '../components/JobDetail.vue';

const router = useRouter();

const showNotify = ref(false);
const messageNotify = ref('');
const isSuccessNotify = ref(true);
const useJob = useJobStore();

// --- Lifecycle Hooks ---
onMounted(async () => {
    // Gọi API lấy dữ liệu ngay khi màn hình vừa mở lên.
    // Lưu ý: Thay đổi tên hàm `fetchListJobMe()` thành tên đúng trong Store của bạn.
    await useJob.getJobOfMeStore();
});

// LẤY DỮ LIỆU THẬT TỪ STgeORE
const jobs = computed<IListJob[]>(() => useJob.listJobMe || []);

// --- TẠO TỪ ĐIỂN THỐNG KÊ RỜI ---
const jobStats = ref<Record<number, number>>({});

watch(jobs, (newJobs) => {
    newJobs.forEach(job => {
        if (job.JobID && !jobStats.value[job.JobID]) {
            const views = job.ApplicationCount + Math.floor(Math.random() * 21); // views = apps + 0~20
            
            jobStats.value[job.JobID] = views;
        }
    });
}, { immediate: true, deep: true });

// --- CẤU HÌNH TABS ---
const tabs = [
    { label: 'Tất cả', value: 'All' },
    { label: 'Đang đăng', value: 'Approved' },
    { label: 'Đang chờ duyệt', value: 'Pending' },
    { label: 'Bị từ chối', value: 'Rejected' }
];
const currentTab = ref('All');

// --- CẤU HÌNH SẮP XẾP ---
const isSortOpen = ref(false);
const currentSort = ref('newest');
const currentSortLabel = ref('Mới nhất');

const sortOptions = [
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Cũ nhất', value: 'oldest' },
];

const selectSort = (option: { label: string, value: string }) => {
    currentSort.value = option.value;
    currentSortLabel.value = option.label;
    isSortOpen.value = false;
    currentPage.value = 1; 
};

// --- PHÂN TRANG & LỌC ---
const ITEMS_PER_PAGE = 3;
const currentPage = ref(1);

const handleTabChange = (tabValue: string) => {
    currentTab.value = tabValue;
    currentPage.value = 1; 
};

const filteredJobs = computed(() => {
    if (currentTab.value === 'All') return jobs.value;
    return jobs.value.filter(job => job.Status === currentTab.value);
});

const sortedAndFilteredJobs = computed(() => {
    const list = [...filteredJobs.value];
    
    list.sort((a, b) => {
        const dateA = new Date(a.CreatedAt || 0).getTime();
        const dateB = new Date(b.CreatedAt || 0).getTime();
        
        if (currentSort.value === 'newest') {
            return dateB - dateA; 
        } else {
            return dateA - dateB; 
        }
    });
    
    return list;
});

const totalPages = computed(() => Math.ceil(sortedAndFilteredJobs.value.length / ITEMS_PER_PAGE));

const paginatedJobs = computed(() => {
    const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
    return sortedAndFilteredJobs.value.slice(start, start + ITEMS_PER_PAGE);
});

const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        document.querySelector('.overflow-y-auto')?.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// --- HELPER FUNCTIONS ---
const getStatusLabel = (status: string) => {
    switch (status) {
        case 'Approved': return 'Đang đăng';
        case 'Pending': return 'Chờ duyệt';
        case 'Rejected': return 'Từ chối';
        default: return status;
    }
};
const isDetailModalOpen = ref(false);
const selectedJobId = ref<number | null>(null);

// Hàm để mở modal khi click vào 1 job
const openJobDetail = (jobId: number | null) => {
    selectedJobId.value = jobId;
    isDetailModalOpen.value = true;
};

const getStatusBadgeClass = (status: string) => {
    const base = "inline-block px-2 py-1 rounded-lg text-[11px] font-bold border";
    if (status === 'Approved') return `${base} bg-emerald-50 text-emerald-600 border-emerald-100`;
    if (status === 'Pending') return `${base} bg-sky-50 text-sky-600 border-sky-100`;
    if (status === 'Rejected') return `${base} bg-red-50 text-red-600 border-red-100`;
    return base;
};

const getStatusLineColor = (status: string) => {
    if (status === 'Approved') return 'from-emerald-400 to-emerald-500';
    if (status === 'Pending') return 'from-sky-400 to-sky-500';
    if (status === 'Rejected') return 'from-red-400 to-red-500';
    return 'from-blue-400 to-blue-500';
};

const formatDate = (date?: Date | string) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return ''; 
    return new Intl.DateTimeFormat('vi-VN').format(d);
};


import EditJonDetail from '../components/EditJonDetail.vue';
// State
const isEditModalOpen = ref(false);
const selectedEditJobId = ref<number | null>(null);

// Mở modal
const openEditModal = (id: number | null) => {
    selectedEditJobId.value = id;
    isEditModalOpen.value = true;
};

// --- LOGIC MODAL XÓA ---
const isDeleteModalOpen = ref(false);
const jobToDeleteId = ref<number | null>(null);

// Hàm mở Modal
const openDeleteModal = (id: number | null) => {
    if (!id) return;
    jobToDeleteId.value = id;
    isDeleteModalOpen.value = true;
    document.body.style.overflow = 'hidden'; // Khóa cuộn trang nền
};

// Hàm đóng Modal
const closeDeleteModal = () => {
    isDeleteModalOpen.value = false;
    jobToDeleteId.value = null;
    document.body.style.overflow = ''; // Mở lại cuộn trang
};

// Hàm xác nhận Xóa
const handleConfirmDelete = async () => {
    if (!jobToDeleteId.value) return;
    await useJob.deleteJobStore(jobToDeleteId.value);
    if (useJob.error) {
        showNotify.value = true;
        isSuccessNotify.value = false;
        messageNotify.value = useJob.message || "Lỗi! Không thể xóa tin tuyển dụng.";
    }
    else {
        showNotify.value = true;
        isSuccessNotify.value = true;
        messageNotify.value = "Xóa tin tuyển dụng thành công!";
        await useJob.getJobOfMeStore();
        
    }
    closeDeleteModal();
};

</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.overflow-y-auto::-webkit-scrollbar { width: 6px; }
.overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 20px;
}
</style>