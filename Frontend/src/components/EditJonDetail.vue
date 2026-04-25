<template>
    <Teleport to="body">
        <transition name="modal-fade">
            <div 
                v-if="isOpen" 
                @click.self="closeModal" 
                class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6"
            >
                <div class="relative bg-[#F8FAFC] rounded-[24px] shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden animate-slide-up border border-white/50">
                    
                    <div class="sticky top-0 z-20 bg-white/80 backdrop-blur-xl px-8 py-5 border-b border-slate-200/60 flex items-center justify-between shrink-0">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                                <i class="fas fa-pen-nib text-lg"></i>
                            </div>
                            <div>
                                <h2 class="text-xl font-extrabold text-slate-800 tracking-tight">Chỉnh sửa tin tuyển dụng</h2>
                                <p class="text-xs font-medium text-slate-500 mt-0.5">Cập nhật thông tin chi tiết cho vị trí này</p>
                            </div>
                        </div>
                        <button type="button" @click="closeModal" class="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-all duration-200">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div v-if="isLoading" class="flex-1 flex flex-col items-center justify-center bg-white py-20 space-y-4">
                        <div class="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
                        <p class="text-slate-500 font-semibold tracking-wide">Đang đồng bộ dữ liệu...</p>
                    </div>

                    <div v-else-if="error" class="flex-1 flex flex-col items-center justify-center bg-white py-20">
                        <div class="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-5 text-3xl shadow-sm border border-red-100">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <p class="text-red-600 font-bold text-lg">{{ error }}</p>
                    </div>

                    <div v-else class="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
                        <form id="editJobForm" @submit.prevent="handleSave" class="space-y-8 max-w-4xl mx-auto">
                            
                            <div class="bg-white p-8 rounded-3xl shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] border border-slate-100">
                                <h3 class="text-base font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-6">
                                    <span class="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs">1</span>
                                    Thông tin chung
                                </h3>
                                
                                <div class="flex flex-col md:flex-row gap-6 mb-6">
                                    <div class="shrink-0 group">
                                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Logo Doanh nghiệp</label>
                                        
                                        <div class="relative w-32 h-32 bg-slate-50 border-2 border-slate-200 border-dashed rounded-2xl p-2 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-400 group-hover:bg-blue-50/30 cursor-pointer">
                                            
                                            <img v-if="formData.CompanyLogo" :src="formData.CompanyLogo" alt="Logo" class="w-full h-full object-contain" />
                                            <div v-else class="flex flex-col items-center gap-1 text-slate-400">
                                                <i class="fas fa-cloud-upload-alt text-2xl"></i>
                                                <span class="text-[10px] font-bold uppercase tracking-wider">Tải ảnh lên</span>
                                            </div>

                                            <div class="absolute inset-0 bg-slate-900/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                                                <button type="button" @click.stop="triggerFileInput" class="w-10 h-10 rounded-full bg-white/20 text-white hover:bg-blue-600 transition-all flex items-center justify-center shadow-sm" title="Đổi ảnh">
                                                    <i class="fas fa-camera"></i>
                                                </button>
                                                <button v-if="formData.CompanyLogo" type="button" @click.stop="removeLogo" class="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-red-500 transition-all flex items-center justify-center shadow-sm" title="Xóa ảnh">
                                                    <i class="fas fa-trash-alt text-xs"></i>
                                                </button>
                                            </div>

                                            <input type="file" ref="fileInputRef" accept="image/png, image/jpeg, image/webp" class="hidden" @change="handleFileUpload" />
                                        </div>
                                    </div>

                                    <div class="flex-1 flex flex-col justify-between space-y-5 md:space-y-0">
                                        <div class="group">
                                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Tiêu đề công việc <span class="text-red-500">*</span></label>
                                            <div class="relative">
                                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <i class="fas fa-heading text-slate-400 group-focus-within:text-blue-600 transition-colors"></i>
                                                </div>
                                                <input v-model="formData.Title" type="text" required class="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-700">
                                            </div>
                                        </div>

                                        <div class="group">
                                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Công ty</label>
                                            <div class="relative">
                                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <i class="fas fa-building text-slate-400 group-focus-within:text-blue-600 transition-colors"></i>
                                                </div>
                                                <input v-model="formData.CompanyName" type="text" class="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-700">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div class="group">
                                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Địa điểm <span class="text-red-500">*</span></label>
                                        <div class="relative">
                                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <i class="fas fa-map-marker-alt text-slate-400 group-focus-within:text-blue-600 transition-colors"></i>
                                            </div>
                                            <input v-model="formData.Location" type="text" required class="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-700">
                                        </div>
                                    </div>
                                    
                                    <div class="group">
                                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Loại hình</label>
                                        <div class="relative">
                                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <i class="fas fa-briefcase text-slate-400 group-focus-within:text-blue-600 transition-colors"></i>
                                            </div>
                                            <input v-model="formData.JobType" type="text" placeholder="VD: Full-time..." class="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-700">
                                        </div>
                                    </div>

                                    <div class="group">
                                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Trạng thái</label>
                                        <div class="relative">
                                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                                <i class="fas fa-toggle-on text-slate-400 group-focus-within:text-blue-600 transition-colors"></i>
                                            </div>
                                            <select v-model="formData.Status" class="w-full pl-11 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-700 appearance-none cursor-pointer">
                                                <option value="Pending">Đang chờ duyệt</option>
                                                <option value="Approved">Đang đăng</option>
                                                <option value="Rejected">Bị từ chối</option>
                                            </select>
                                            <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <i class="fas fa-chevron-down text-slate-400 text-xs"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-white p-8 rounded-3xl shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] border border-slate-100">
                                <h3 class="text-base font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-6">
                                    <span class="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs">2</span>
                                    Chế độ & Yêu cầu
                                </h3>
                                
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div class="group">
                                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Lương Tối thiểu</label>
                                        <div class="relative">
                                            <input v-model="formData.SalaryMin" type="number" class="w-full pl-4 pr-12 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-700">
                                            <span class="absolute inset-y-0 right-4 flex items-center text-xs font-bold text-slate-400">VNĐ</span>
                                        </div>
                                    </div>
                                    <div class="group">
                                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Lương Tối đa</label>
                                        <div class="relative">
                                            <input v-model="formData.SalaryMax" type="number" class="w-full pl-4 pr-12 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-700">
                                            <span class="absolute inset-y-0 right-4 flex items-center text-xs font-bold text-slate-400">VNĐ</span>
                                        </div>
                                    </div>
                                    <div class="group">
                                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Số lượng</label>
                                        <div class="relative">
                                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <i class="fas fa-users text-slate-400 group-focus-within:text-blue-600 transition-colors"></i>
                                            </div>
                                            <input v-model="formData.Quantity" type="number" min="1" class="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-700">
                                        </div>
                                    </div>
                                    <div class="md:col-span-3 group">
                                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Thời gian làm việc</label>
                                        <div class="relative">
                                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <i class="fas fa-clock text-slate-400 group-focus-within:text-blue-600 transition-colors"></i>
                                            </div>
                                            <input v-model="formData.WorkingSchedule" type="text" placeholder="Thứ 2 - Thứ 6 (08:30 - 17:30)" class="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-700">
                                        </div>
                                    </div>
                                </div>

                                <div class="space-y-6">
                                    <div>
                                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Mô tả chi tiết công việc</label>
                                        <textarea v-model="formData.Description" rows="4" class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-700 resize-none"></textarea>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Yêu cầu đối với ứng viên</label>
                                        <textarea v-model="formData.Requirements" rows="4" class="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-700 resize-none"></textarea>
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                <div class="bg-white p-6 rounded-3xl shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col h-full">
                                    <div class="flex items-center justify-between mb-4">
                                        <h3 class="text-base font-extrabold text-slate-800 flex items-center gap-2">
                                            <div class="w-8 h-8 rounded-lg bg-green-50 text-green-500 flex items-center justify-center"><i class="fas fa-gift"></i></div>
                                            Quyền lợi
                                        </h3>
                                        <button type="button" @click="addBenefit" class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-green-500 hover:text-white transition-colors flex items-center justify-center shadow-sm">
                                            <i class="fas fa-plus text-sm"></i>
                                        </button>
                                    </div>
                                    
                                    <div class="space-y-3 flex-1">
                                        <transition-group name="list">
                                            <div v-for="(benefit, index) in formData.Benefits" :key="index" class="flex items-start gap-2 group">
                                                <div class="mt-2 text-green-500"><i class="fas fa-check-circle text-xs"></i></div>
                                                <input v-model="formData.Benefits[index]" type="text" placeholder="Nhập quyền lợi..." class="flex-1 px-3 py-2 bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 outline-none text-sm font-medium text-slate-700 transition-colors">
                                                <button type="button" @click="removeBenefit(index)" class="mt-1 w-7 h-7 rounded bg-white text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <i class="fas fa-trash-alt text-xs"></i>
                                                </button>
                                            </div>
                                        </transition-group>
                                        <p v-if="formData.Benefits.length === 0" class="text-sm text-slate-400 italic mt-2 text-center py-4">Bấm dấu + để thêm quyền lợi</p>
                                    </div>
                                </div>

                                <div class="bg-white p-6 rounded-3xl shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col h-full">
                                    <div class="flex items-center justify-between mb-4">
                                        <h3 class="text-base font-extrabold text-slate-800 flex items-center gap-2">
                                            <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center"><i class="fas fa-tags"></i></div>
                                            Thẻ (Tags)
                                        </h3>
                                        <button type="button" @click="addTag" class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center shadow-sm">
                                            <i class="fas fa-plus text-sm"></i>
                                        </button>
                                    </div>
                                    
                                    <div class="flex flex-wrap gap-2 items-center">
                                        <transition-group name="list">
                                            <div v-for="(tag, index) in formData.Tags" :key="index" class="flex items-center gap-1 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                                                <span class="text-slate-400 text-xs">#</span>
                                                <input v-model="formData.Tags[index]" type="text" placeholder="Tên tag..." class="bg-transparent border-none outline-none text-sm font-bold text-slate-700 w-20 p-0 placeholder:font-normal">
                                                <button type="button" @click="removeTag(index)" class="text-slate-400 hover:text-red-500 transition-colors ml-1 w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-50">
                                                    <i class="fas fa-times text-[10px]"></i>
                                                </button>
                                            </div>
                                        </transition-group>
                                        <p v-if="formData.Tags.length === 0" class="text-sm text-slate-400 italic w-full text-center py-4">Bấm dấu + để thêm thẻ phân loại</p>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-white p-8 rounded-3xl shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] border border-slate-100">
                                <div class="flex items-center justify-between mb-8">
                                    <h3 class="text-base font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                        <span class="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs">3</span>
                                        Quy trình phỏng vấn
                                    </h3>
                                    <button type="button" @click="addInterviewRound" class="px-4 py-2 bg-blue-50/50 text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-100 hover:shadow-sm transition-all flex items-center gap-2 border border-blue-100">
                                        <i class="fas fa-plus"></i> Thêm vòng
                                    </button>
                                </div>
                                
                                <div class="pl-4 border-l-2 border-slate-100 space-y-8 relative pb-2 mt-4">
                                    <transition-group name="list">
                                        <div v-for="(round, index) in formData.InterviewProcess" :key="index" class="relative pl-6">
                                            
                                            <div class="absolute -left-[35px] top-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-extrabold border-4 border-white shadow-sm z-10">
                                                {{ index + 1 }}
                                            </div>

                                            <div class="bg-slate-50/50 border border-slate-200 rounded-2xl p-5 relative group">
                                                <button type="button" @click="removeInterviewRound(index)" class="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-200 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <i class="fas fa-trash-alt text-xs"></i>
                                                </button>
                                                
                                                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 pr-8">
                                                    <div>
                                                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Thứ tự</label>
                                                        <input v-model="round.RoundOrder" type="number" class="w-24 px-3 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm font-bold text-slate-700 text-center transition-all">
                                                    </div>
                                                    <div class="md:col-span-3">
                                                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Tên vòng phỏng vấn</label>
                                                        <input v-model="round.RoundTitle" type="text" placeholder="VD: Phỏng vấn kỹ thuật" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm font-bold text-slate-700 transition-all">
                                                    </div>
                                                    <div class="md:col-span-4 mt-2">
                                                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Chi tiết nội dung</label>
                                                        <textarea v-model="round.Details" rows="2" placeholder="Nội dung sẽ trao đổi, yêu cầu chuẩn bị..." class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm font-medium text-slate-700 resize-none transition-all"></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </transition-group>
                                </div>
                                <div v-if="formData.InterviewProcess?.length === 0" class="text-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                    <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300 mx-auto mb-3 shadow-sm"><i class="fas fa-sitemap text-xl"></i></div>
                                    <p class="text-sm font-medium text-slate-500">Chưa có dữ liệu quy trình phỏng vấn.</p>
                                    <p class="text-xs text-slate-400 mt-1">Việc minh bạch quy trình sẽ thu hút ứng viên chất lượng hơn.</p>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="sticky bottom-0 z-20 bg-white/80 backdrop-blur-xl px-8 py-5 border-t border-slate-200/60 flex items-center justify-between shrink-0 rounded-b-[24px]">
                        <p class="text-xs font-medium text-slate-400 hidden sm:block">
                            <i class="fas fa-info-circle mr-1"></i> Kiểm tra kỹ thông tin trước khi lưu
                        </p>
                        <div class="flex items-center gap-3 w-full sm:w-auto">
                            <button type="button" @click="closeModal" class="flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-sm">
                                Hủy bỏ
                            </button>
                            <button type="submit" form="editJobForm" class="flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 text-sm">
                                <i class="fas fa-check-circle"></i> Lưu cập nhật
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useJobStore } from '../stores/job';

export interface IInterviewRound {
    RoundOrder: number;
    RoundTitle: string;
    Details: string;
}

export interface IJobDetail {
    JobID: number;
    Title: string;
    Location: string;
    CreatedAt: Date | string;
    CompanyName: string;
    CompanyLogo: string;
    Status: string;
    SalaryMin: number;
    SalaryMax: number;
    JobType: string;
    Quantity: number;
    Description: string;
    WorkingSchedule?: string;
    Requirements: string;
    Benefits: string[];
    Tags: string[];
    RawTextForAi: string;
    InterviewProcess?: IInterviewRound[];
}

const props = defineProps<{
    isOpen: boolean;
    jobId: number | null;
}>();

const emit = defineEmits(['close', 'save']);
const useJob = useJobStore();

const isLoading = ref(false);
const error = ref('');

const formData = ref<IJobDetail>({
    JobID: 0,
    Title: '',
    Location: '',
    CreatedAt: new Date(),
    CompanyName: '',
    CompanyLogo: '',
    Status: 'Pending',
    SalaryMin: 0,
    SalaryMax: 0,
    JobType: '',
    Quantity: 1,
    Description: '',
    WorkingSchedule: '',
    Requirements: '',
    Benefits: [],
    Tags: [],
    RawTextForAi: '',
    InterviewProcess: []
});

// LOGIC TẢI ẢNH LOGO
const fileInputRef = ref<HTMLInputElement | null>(null);
const fileToUpload = ref<File | null>(null); 

const triggerFileInput = () => {
    fileInputRef.value?.click();
};

const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
        fileToUpload.value = file;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            formData.value.CompanyLogo = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
};

const removeLogo = () => {
    formData.value.CompanyLogo = '';
    fileToUpload.value = null;
    if (fileInputRef.value) {
        fileInputRef.value.value = ''; 
    }
};

// WATCHER
watch(() => props.isOpen, async (newVal) => {
    if (newVal && props.jobId) {
        document.body.style.overflow = 'hidden';
        isLoading.value = true;
        error.value = '';
        fileToUpload.value = null;
        
        try {
            const jobDetail = await useJob.getJobDetailStore(props.jobId);
            
            if (jobDetail) {
                formData.value = JSON.parse(JSON.stringify(jobDetail));
                
                if (!formData.value.Benefits) formData.value.Benefits = [];
                if (!formData.value.Tags) formData.value.Tags = [];
                if (!formData.value.InterviewProcess) formData.value.InterviewProcess = [];
                if (!formData.value.CompanyLogo) formData.value.CompanyLogo = ''; 
            } else {
                error.value = "Không tìm thấy thông tin công việc!";
            }
        } catch (err) {
            console.error("Lỗi get data chi tiết:", err);
            error.value = "Lấy dữ liệu thất bại, vui lòng thử lại!";
        } finally {
            isLoading.value = false;
        }

    } else {
        document.body.style.overflow = '';
        error.value = '';
    }
});

const closeModal = () => emit('close');

const addBenefit = () => formData.value.Benefits.push('');
const removeBenefit = (index: number) => formData.value.Benefits.splice(index, 1);

const addTag = () => formData.value.Tags.push('');
const removeTag = (index: number) => formData.value.Tags.splice(index, 1);

const addInterviewRound = () => {
    const nextOrder = formData.value.InterviewProcess!.length + 1;
    formData.value.InterviewProcess!.push({
        RoundOrder: nextOrder,
        RoundTitle: '',
        Details: ''
    });
};
const removeInterviewRound = (index: number) => formData.value.InterviewProcess!.splice(index, 1);

const handleSave = () => {
    formData.value.Benefits = formData.value.Benefits.filter(b => b.trim() !== '');
    formData.value.Tags = formData.value.Tags.filter(t => t.trim() !== '');
    
    emit('save', {
        jobData: formData.value,
        logoFile: fileToUpload.value 
    });
};
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.animate-slide-up { animation: slideUpModal 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideUpModal {
    from { opacity: 0; transform: translateY(30px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}
.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(-15px); }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; border: 2px solid #F8FAFC; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
</style>