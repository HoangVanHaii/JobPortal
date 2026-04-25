<script setup lang="ts">
import { ref } from 'vue';
import { X, MapPin, CircleDollarSign, Send, Loader2, Bot, Sparkles } from 'lucide-vue-next';
import { formatSalary } from '../utils/format';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
    jobs: {
        type: Array as () => any[],
        default: () => []
    },
    keyword: {
        type: String,
        default: ''
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close', 'view-job', 'search']);

const newSearchQuery = ref('');

const handleNewSearch = () => {
    if (!newSearchQuery.value.trim()) return;
    emit('search', newSearchQuery.value);
    newSearchQuery.value = ''; 
};
</script>

<template>
    <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 transition-opacity" @click="emit('close')"></div>

    <div class="fixed top-0 right-0 bottom-0 w-full sm:w-[450px] bg-[#f4f7fb] z-50 flex flex-col shadow-2xl animate-in slide-in-from-right-8 duration-300">
        
        <div class="px-5 py-4 bg-white border-b border-gray-100 flex justify-between items-center shadow-sm z-10">
            <div class="flex items-center gap-2">
                <div class="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                    <Sparkles class="w-5 h-5" />
                </div>
                <h3 class="font-bold text-gray-800 text-[16px]">AI Tìm Việc</h3>
            </div>
            <button @click="emit('close')" class="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors group">
                <X class="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
            
            <div v-if="keyword" class="flex flex-col items-end gap-1">
                <div class="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-[14.5px] shadow-sm max-w-[85%]">
                    Tìm cho tôi công việc liên quan đến: <span class="font-bold">"{{ keyword }}"</span>
                </div>
            </div>

            <div class="flex flex-col items-start gap-2">
                <div class="flex items-center gap-2 pl-1">
                    <div class="w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
                        <Bot class="w-4 h-4 text-blue-600" />
                    </div>
                    <span class="text-xs font-semibold text-gray-500">Trợ lý AI</span>
                </div>

                <div v-if="loading" class="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-3">
                    <Loader2 class="w-5 h-5 animate-spin text-blue-600" />
                    <span class="text-[14px] text-gray-600">Đang phân tích dữ liệu và tìm kiếm cơ hội...</span>
                </div>

                <div v-else class="w-full">
                    
                    <div class="bg-white border border-gray-100 px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-sm inline-block mb-3">
                        <span class="text-[14.5px] text-gray-700">
                            <template v-if="jobs.length > 0">
                                Tôi đã tìm thấy <span class="font-bold text-blue-600">{{ jobs.length }}</span> công việc phù hợp nhất với yêu cầu của bạn:
                            </template>
                            <template v-else>
                                Rất tiếc, tôi không tìm thấy công việc nào phù hợp với từ khóa này. Bạn thử tìm từ khóa khác xem sao nhé!
                            </template>
                        </span>
                    </div>

                    <div v-if="jobs.length > 0" class="flex flex-col gap-3">
                        <div 
                            v-for="job in jobs" 
                            :key="job.JobID" 
                            @click="router.push(`/job-detail/${job.JobID}`); emit('close');"
                            class="bg-white border border-gray-200 hover:border-blue-300 p-3.5 rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md group flex items-start gap-3"
                        >
                            <div class="flex-shrink-0">
                                <div class="w-14 h-14 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden p-1.5">
                                    <img :src="job.CompanyLogo || '/src/assets/bg-login.jpg'" class="w-full h-full object-contain mix-blend-multiply"/>
                                </div>
                            </div>
                            
                            <div class="flex-1 min-w-0">
                                <h3 class="text-[#4c5bd4] font-semibold text-[15px] leading-tight truncate group-hover:underline">
                                    {{ job.Title }}
                                </h3>
                                <p class="text-gray-500 text-[13px] truncate mt-1">
                                    {{ job.CompanyName }}
                                </p>
                                
                                <div class="flex items-center gap-4 mt-2.5">
                                    <div class="flex items-center gap-1.5 text-gray-500 text-[12px]">
                                        <MapPin class="w-3.5 h-3.5" />
                                        <span class="truncate max-w-[100px]">{{ job.Location }}</span>
                                    </div>
                                    <div class="flex items-center gap-1.5 text-[#d866d3] font-medium text-[12px]">
                                        <CircleDollarSign class="w-3.5 h-3.5" />
                                        <span>{{ formatSalary(job.SalaryMin, job.SalaryMax) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>

        <div class="p-4 bg-white border-t border-gray-100 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
            <div class="relative flex items-center">
                <input 
                    v-model="newSearchQuery"
                    @keyup.enter="handleNewSearch"
                    type="text" 
                    placeholder="Nhập kỹ năng, vị trí muốn tìm..." 
                    class="w-full bg-gray-100 border-transparent focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-[14.5px] rounded-full pl-5 pr-12 py-3 outline-none transition-all"
                    :disabled="loading"
                />
                <button 
                    @click="handleNewSearch"
                    :disabled="!newSearchQuery.trim() || loading"
                    class="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full transition-colors"
                >
                    <Send class="w-4 h-4 ml-0.5" />
                </button>
            </div>
            <p class="text-center text-[11px] text-gray-400 mt-2">AI có thể mắc lỗi. Vui lòng kiểm tra lại thông tin chi tiết.</p>
        </div>

    </div>
</template>