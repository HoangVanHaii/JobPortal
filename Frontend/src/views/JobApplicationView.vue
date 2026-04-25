<template>
    <Notify  
        v-if="showNotify" 
        :message="messageNotify" 
        :isSuccess="isSuccessNotify" 
        @close="showNotify = false"
    />

    <Loading v-if="useJob.loading && !isViewingApplications" />
    
    <div class="flex flex-col lg:flex-row h-screen w-full bg-[#F1F5F9] font-sans text-slate-800 overflow-hidden">
        
        <SidebarEmployer />

        <div 
            ref="mainContent"
            class="flex-1 h-full overflow-y-auto custom-scrollbar flex flex-col relative"
        >
            
            <transition name="fade-content" mode="out-in">
                
                <div v-if="!isViewingApplications" class="max-w-7xl mx-auto w-full flex-1 flex flex-col p-4 sm:p-8 space-y-6">
                    
                    <div class="flex items-center gap-4 animate-fade-in">
                        <div class="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20 shrink-0">
                            <i class="fas fa-address-book text-xl"></i>
                        </div>
                        <div>
                            <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Hồ sơ ứng tuyển</h1>
                            <p class="text-sm font-medium text-slate-500 mt-0.5">Quản lý và xét duyệt các ứng viên đã nộp hồ sơ vào chiến dịch của bạn.</p>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-slate-100 p-3 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-20">
                        <div class="relative w-full sm:w-80" v-click-outside="() => isPositionDropdownOpen = false">
                            <div 
                                @click="isPositionDropdownOpen = !isPositionDropdownOpen"
                                class="flex items-center justify-between w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 hover:border-blue-400 cursor-pointer text-slate-700 py-3 px-5 rounded-xl transition-all"
                            >
                                <span class="font-bold text-sm truncate pr-2">
                                    {{ filterPosition === 'All' ? 'Tất cả vị trí tuyển dụng' : filterPosition }}
                                </span>
                                <i class="fas fa-chevron-down text-slate-400 text-xs transition-transform duration-200" :class="{ 'rotate-180': isPositionDropdownOpen }"></i>
                            </div>

                            <transition name="dropdown-fade">
                                <div v-if="isPositionDropdownOpen" class="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-lg py-2 z-50 overflow-hidden">
                                    <div class="max-h-60 overflow-y-auto custom-scrollbar">
                                        <div @click="selectFilterPosition('All')" class="px-5 py-3 text-sm cursor-pointer hover:bg-slate-50" :class="filterPosition === 'All' ? 'text-blue-600 font-bold' : ''">Tất cả vị trí</div>
                                        <div v-for="title in uniqueJobTitles" :key="title" @click="selectFilterPosition(title)" class="px-5 py-3 text-sm cursor-pointer hover:bg-slate-50" :class="filterPosition === title ? 'text-blue-600 font-bold' : ''">{{ title }}</div>
                                    </div>
                                </div>
                            </transition>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 flex-1 content-start">
                        <div v-for="job in displayedJobs" :key="job.JobID" class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            
                            <div class="bg-[#435EFA] px-5 py-4 text-center border-b border-blue-700/50">
                                <h3 class="text-white font-extrabold text-[15px] truncate">
                                    {{ job.CompanyName || 'Công ty ẩn danh' }}
                                </h3>
                            </div>

                            <div class="p-3 flex-1 flex flex-col gap-2 bg-white">
                                
                                <div class="flex items-center gap-3 text-sm font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-xl border">
                                    <i class="fas fa-calendar-alt text-slate-500 text-[11px]"></i>
                                    <span>Ngày đăng: {{ formatDate(job.CreatedAt) }}</span>
                                </div>

                                <div class="flex items-center gap-3 text-[15px] font-black text-[#E53E3E] px-1">
                                    <i class="fas fa-thumbtack text-[13px]"></i>
                                    <span class="truncate">{{ job.Title }}</span>
                                </div>

                                <div class="flex items-center justify-between px-1">
                                    <div class="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-[11px] font-black border">
                                        <i class="fas fa-users text-[10px]"></i>
                                        <span>{{ job.ApplicationCount || 0 }} ứng tuyển</span>
                                    </div>
                                </div>

                                <div class="mt-auto pt-2 flex justify-center">
                                    <button 
                                        @click="viewApplications(job.JobID, job.Title)" 
                                        class="bg-[#3B5BFA] hover:bg-blue-700 text-white font-semibold py-2 px-14 rounded-lg text-xs flex items-center gap-2"
                                    >
                                        XEM ỨNG VIÊN
                                    </button>
                                </div>

                            </div>
                        </div>

                        <div v-if="displayedJobs.length === 0 && !useJob.loading" class="col-span-full py-24 bg-white rounded-[32px] border border-dashed text-center">
                            <h3 class="text-xl font-extrabold text-slate-700">Chưa có dữ liệu</h3>
                        </div>
                    </div>

                </div>

                <ApplicationsView 
                    v-else 
                    :jobId="selectedJobId" 
                    :jobTitle="selectedJobTitle"
                    @back="handleBackToJobs" 
                />

            </transition>
        </div>
    </div>
</template>>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import SidebarEmployer from '../components/SidebarEmployer.vue';
import Notify from '../components/Notify.vue';
import Loading from '../components/Loading.vue';
import { useJobStore } from '../stores/job';
import ApplicationsView from './ApplicationsView.vue';

// --- INTERFACE DỮ LIỆU ---
export interface IListJob {
    JobID?: number;
    Title: string;
    Location: string;
    CreatedAt?: Date;
    CompanyName: string;
    CompanyLogo: string;
    Description: string;
    Status: string;
    ApplicationCount: number;   
}

// --- LOGIC ĐIỀU HƯỚNG ---
const isViewingApplications = ref(false);
const selectedJobId = ref<number | null>(null);
const selectedJobTitle = ref<string>('');

const viewApplications = (jobId?: number, jobName?: string) => {
    if (!jobId) return;
    selectedJobId.value = jobId;
    selectedJobTitle.value = jobName || '';
    isViewingApplications.value = true;
};

const handleBackToJobs = () => {
    isViewingApplications.value = false;
    selectedJobId.value = null;
    selectedJobTitle.value = '';
};

// --- LOGIC XỬ LÝ DỮ LIỆU JOB ---
const vClickOutside = {
    mounted(el: any, binding: any) {
        el.clickOutsideEvent = function (event: Event) {
            if (!(el == event.target || el.contains(event.target))) {
                binding.value();
            }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
    },
    unmounted(el: any) {
        document.body.removeEventListener('click', el.clickOutsideEvent);
    },
};

const showNotify = ref(false);
const messageNotify = ref('');
const isSuccessNotify = ref(true);
const useJob = useJobStore();

const ITEMS_PER_PAGE = 6; 
const currentPage = ref(1);

const fetchJobs = async () => {
    const hasData = await useJob.getJobOfMeStore(currentPage.value, ITEMS_PER_PAGE);
    if (!hasData && currentPage.value > 1) {
        currentPage.value--; 
        showNotify.value = true;
        isSuccessNotify.value = false;
        messageNotify.value = "Hiện tại không còn dữ liệu để hiển thị.";
    }
};

onMounted(() => {
    fetchJobs();
});

const isPositionDropdownOpen = ref(false);
const filterPosition = ref('All');
const sortOrder = ref('newest');

const selectFilterPosition = (title: string) => {
    filterPosition.value = title;
    isPositionDropdownOpen.value = false;
    currentPage.value = 1; 
};

const uniqueJobTitles = computed(() => {
    const titles = (useJob.listJobMe || []).map(job => job.Title);
    return [...new Set(titles)];
});

const displayedJobs = computed(() => {
    let result = [...(useJob.listJobMe || [])];
    if (filterPosition.value !== 'All') {
        result = result.filter(job => job.Title === filterPosition.value);
    }
    result.sort((a, b) => {
        const dateA = new Date(a.CreatedAt || 0).getTime();
        const dateB = new Date(b.CreatedAt || 0).getTime();
        return sortOrder.value === 'newest' ? dateB - dateA : dateA - dateB;
    });
    return result;
});

const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

// --- PHÂN TRANG ---
const scrollToTop = () => {
    document.querySelector('.overflow-y-auto')?.scrollTo({ top: 0, behavior: 'smooth' });
};

const nextPage = async () => {
    if (useJob.hasNextPage) {
        currentPage.value++;
        await fetchJobs();
        scrollToTop();
    }
};

const prevPage = async () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        await fetchJobs();
        scrollToTop();
    }
};
</script>

<style scoped>
.fade-content-enter-active, .fade-content-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-content-enter-from { opacity: 0; transform: translateY(10px); }
.fade-content-leave-to { opacity: 0; transform: translateY(-10px); }

.dropdown-fade-enter-active, .dropdown-fade-leave-active { transition: all 0.2s ease; }
.dropdown-fade-enter-from, .dropdown-fade-leave-to { opacity: 0; transform: translateY(-5px); }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
</style>