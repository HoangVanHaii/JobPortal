<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useCompanyStore } from '../stores/company';
import Notify from '../components/Notify.vue';
import Loading from '../components/Loading.vue';
import type{ ICompanyResponse, ICreateCompany, IJoinCompanyRequest } from '../types/company';
const showNotify = ref(false);
const messageNotify = ref('');
const isSuccessNotify = ref(true);
const useCompany = useCompanyStore();

const isDropdownOpen = ref(false);
const selectedCompany = ref<ICompanyResponse | null>(null);
const loading = ref<Boolean>(false);

const selectCompany = (company: ICompanyResponse) => {
    selectedCompany.value = company;
    joinForm.CompanyId = company.CompanyID;
    isDropdownOpen.value = false;
};

import { onMounted, onBeforeUnmount } from 'vue';

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.dropdown-wrapper')) {
    isDropdownOpen.value = false;
  }
};


onMounted( async () => {
    document.addEventListener('click', handleClickOutside);
    // await useCompany.getAllCompanyStore();
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

const activeTab = ref(1);

// FILE
const logoFile = ref<File | null>(null);
const licenseFile = ref<File | null>(null);

// PREVIEW
const logoPreview = ref('');
const licensePreviewUrl = ref('');

// FORM DATA
const companyForm = reactive<ICreateCompany>({
  CompanyName: '',
  CompanyDescription: '',
  TaxCode: '',
  Industry: '',
  Website: '',
  LogoUrl: '',
  ContactEmail: '',
    City: '',
  Position: '',
  BusinessLicenseUrl: ''
});

const joinForm = reactive<IJoinCompanyRequest>({
  CompanyId: 0,
  Position: ''
});


// UPLOAD
const onLogoChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files?.[0]) {
    logoFile.value = target.files[0];
    logoPreview.value = URL.createObjectURL(target.files[0]);
  }
};

const onLicenseChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files?.[0]) {
    licenseFile.value = target.files[0];
    licensePreviewUrl.value = URL.createObjectURL(target.files[0]);
  }
};

// SUBMIT
const handleSubmit = async () => {
    if (activeTab.value === 1) {

        if (!companyForm.CompanyName.trim()) return showToast("Nhập tên công ty", false);
        if (!/^\d{10}$/.test(companyForm.TaxCode.trim())) return showToast("Mã số thuế phải đúng 10 chữ số", false);
        if (!companyForm.Industry.trim()) return showToast("Nhập ngành nghề", false);
        if (!companyForm.City?.trim()) return showToast("Nhập thành phố", false);
        if (!companyForm.ContactEmail?.trim()) return showToast("Nhập email", false);
        if(!companyForm.Position.trim()) return showToast("Nhập chức vụ của bạn trong công ty", false);
        if (!licenseFile.value) return showToast("Thiếu giấy phép kinh doanh", false);

        const formData = new FormData();
        formData.append('CompanyName', companyForm.CompanyName);
        formData.append('CompanyDescription', companyForm.CompanyDescription || '');
        formData.append('TaxCode', companyForm.TaxCode);
        formData.append('Industry', companyForm.Industry);
        formData.append('Website', companyForm.Website || '');
        formData.append('ContactEmail', companyForm.ContactEmail || '');
        formData.append('City', companyForm.City || '');
        formData.append('Position', companyForm.Position);

        if (logoFile.value) formData.append('LogoUrl', logoFile.value);
        formData.append('BusinessLicenseUrl', licenseFile.value);
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        await useCompany.createCompanyStore(formData);
        if(useCompany.error) {
            return showToast(useCompany.message || "Đăng ký công ty thất bại!", false);
        }
        else {
            
            showToast("Đăng ký công ty thành công!", true);
        }
    
    }
    else {
        if (!joinForm.CompanyId) return showToast("Chọn công ty bạn muốn gia nhập", false);
        if (!joinForm.Position.trim()) return showToast("Nhập vị trí hiện tại của bạn", false);

        await useCompany.requestCompanyStore(joinForm.CompanyId, joinForm.Position);
        if(useCompany.error) {
            return showToast(useCompany.message || "Gửi yêu cầu thất bại!", false);
        }
        else {
            showToast("Gửi yêu cầu thành công! Vui lòng chờ admin phê duyệt.", true);
        }
    }
};
const changeTab = async (tabIndex: number) => {
    activeTab.value = tabIndex;
    if (tabIndex === 2) {
        await useCompany.getAllCompanyStore();
    }
};  

const showToast = (msg: string, success = true) => {
    messageNotify.value = msg;
    isSuccessNotify.value = success;
    showNotify.value = true;
};
</script>
<template>
    <Notify 
      v-if="showNotify" 
      :message="messageNotify" 
      :isSuccess="isSuccessNotify" 
      @close="showNotify = false"
    />
    <Loading 
        v-if="useCompany.loading"
    />
    <div class="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-slate-800 font-sans relative dropdown-wrapper">
      <div class="max-w-4xl mx-auto">
        
        <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          <div class="flex p-2 bg-slate-50/80 border-b border-slate-100 gap-2">
            <button @click="changeTab(1)" 
              :class="['flex-1 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2.5', 
                       activeTab === 1 ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700']">
              <i class="fas fa-building text-lg"></i> Đăng ký công ty mới
            </button>
            <button @click="changeTab(2)" 
              :class="['flex-1 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2.5', 
                       activeTab === 2 ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700']">
              <i class="fas fa-handshake text-lg"></i> Yêu cầu vào công ty
            </button>
          </div>
  
          <div class="p-6 sm:p-10 lg:p-12">
            
            <form v-if="activeTab === 1" @submit.prevent="handleSubmit" class="space-y-10 animate-in fade-in duration-500">
              
              <div class="flex flex-col lg:flex-row gap-10 items-start">
                <div class="w-full lg:w-48 shrink-0 flex flex-col items-center lg:items-start">
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Logo thương hiệu</label>
                  <div class="relative w-36 h-36 group">
                    <input type="file" accept="image/*" @change="onLogoChange" class="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                    <div class="w-full h-full rounded-full border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-blue-400 group-hover:bg-blue-50/50 group-hover:shadow-md">
                      <img v-if="logoPreview" :src="logoPreview" class="w-full h-full object-cover" />
                      <div v-else class="text-center flex flex-col items-center justify-center space-y-2 text-slate-400 group-hover:text-blue-500">
                        <i class="fas fa-camera text-3xl"></i>
                        <span class="text-[10px] font-bold uppercase tracking-wide">Tải ảnh</span>
                      </div>
                    </div>
                  </div>
                </div>
  
                <div class="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div class="col-span-full">
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">Tên công ty chính thức <span class="text-red-500">*</span></label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <i class="fas fa-font"></i>
                      </div>
                      <input v-model="companyForm.CompanyName" type="text" required class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm placeholder-slate-400" placeholder="Ví dụ: Công ty Cổ phần Công nghệ AI">
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">Mã số thuế <span class="text-red-500">*</span></label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <i class="fas fa-hashtag"></i>
                      </div>
                      <input v-model="companyForm.TaxCode" type="text" required class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm placeholder-slate-400" placeholder="Nhập mã số thuế">
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">Lĩnh vực hoạt động <span class="text-red-500">*</span></label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <i class="fas fa-briefcase"></i>
                      </div>
                      <input v-model="companyForm.Industry" type="text" required class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm placeholder-slate-400" placeholder="Ví dụ: IT, Bán lẻ...">
                    </div>
                  </div>
                </div>
              </div>
  
              <div class="h-px w-full bg-slate-100"></div>
  
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div class="flex flex-col">
                  <label class="block text-sm font-semibold text-slate-700 mb-3">Giấy phép kinh doanh <span class="text-slate-400 font-normal">(Bản scan/Ảnh)</span> <span class="text-red-500">*</span></label>
                  <div class="relative group flex-1 min-h-[200px] w-full rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 overflow-hidden transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/30 flex items-center justify-center">
                    <input type="file" accept="image/*" @change="onLicenseChange" class="absolute inset-0 opacity-0 z-20 cursor-pointer" />
                    <img v-if="licensePreviewUrl" :src="licensePreviewUrl" class="w-full h-full object-contain p-2" />
                    <div v-else class="text-center text-slate-400 group-hover:text-blue-500 transition-colors flex flex-col items-center">
                      <i class="fas fa-file-invoice text-4xl mb-3"></i>
                      <span class="font-medium text-sm">Nhấn để tải file ảnh lên</span>
                    </div>
                  </div>
                </div>
  
                <div class="space-y-5">
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">Thành phố <span class="text-red-500">*</span></label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <i class="fas fa-map-marker-alt"></i>
                      </div>
                      <input v-model="companyForm.City" type="text" required class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm placeholder-slate-400" placeholder="Ví dụ: TP. Hồ Chí Minh">
                    </div>
                  </div> 
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">Chức vụ của bạn <span class="text-red-500">*</span></label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <i class="fas fa-user-tie"></i>
                      </div>
                      <input v-model="companyForm.Position" type="text" required class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm placeholder-slate-400" placeholder="Ví dụ: HR Manager, CEO..." >
                    </div>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label class="block text-sm font-semibold text-slate-700 mb-1.5">Email liên hệ <span class="text-red-500">*</span></label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <i class="fas fa-envelope"></i>
                        </div>
                        <input v-model="companyForm.ContactEmail" required type="email" class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm placeholder-slate-400" placeholder="hr@company.com">
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-slate-700 mb-1.5">Website</label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <i class="fas fa-globe"></i>
                        </div>
                        <input v-model="companyForm.Website" type="url" class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm placeholder-slate-400" placeholder="https://...">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              <div class="pt-6">
                <button type="submit" class="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2.5">
                  <i class="fas fa-check-circle text-lg"></i>
                  Hoàn tất khởi tạo doanh nghiệp
                </button>
              </div>
            </form>
  
            <form v-if="activeTab === 2" @submit.prevent="handleSubmit" class="space-y-10">

<!-- INFO BOX -->
<div class="flex gap-4 p-5 rounded-2xl bg-blue-50 border border-blue-100">
  <div class="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 shrink-0">
    <i class="fas fa-info text-sm"></i>
  </div>
  <div>
    <h4 class="text-blue-900 font-bold text-sm mb-1">Gia nhập công ty hiện có</h4>
    <p class="text-blue-700 text-xs leading-relaxed">
      Yêu cầu của bạn sẽ được gửi tới quản trị viên để xét duyệt.
    </p>
  </div>
</div>

<!-- SELECT COMPANY -->
<div class="space-y-2">
  <label class="text-sm font-semibold text-slate-700">
    Chọn doanh nghiệp <span class="text-red-500">*</span>
  </label>

  <div class="relative">
    <div 
      @click="isDropdownOpen = !isDropdownOpen"
      class="w-full flex items-center justify-between px-4 py-4 bg-white border border-slate-200 rounded-2xl cursor-pointer transition-all shadow-sm hover:border-blue-400"
      :class="{ 'border-blue-500 ring-2 ring-blue-500/10': isDropdownOpen }"
    >
      <span v-if="!selectedCompany" class="text-slate-400 text-sm">
        -- Chọn công ty --
      </span>

      <div v-else class="flex flex-col">
        <span class="text-sm font-semibold text-slate-700">
          {{ selectedCompany.CompanyName }}
        </span>
        <span class="text-xs text-slate-400">
          {{ selectedCompany.City }}
        </span>
      </div>

      <i class="fas fa-chevron-down text-xs text-slate-400 transition"
         :class="{ 'rotate-180': isDropdownOpen }"></i>
    </div>

    <!-- DROPDOWN -->
    <div 
      v-if="isDropdownOpen"
      class="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden max-h-64 overflow-y-auto"
    >
      <div 
        v-for="c in useCompany.listCompany" :key="c.CompanyID"
        @click="selectCompany(c)"
        class="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition"
      >
      <div class="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 text-blue-600 text-sm font-bold overflow-hidden shrink-0">
        <img 
            v-if="c.LogoUrl" 
            :src="c.LogoUrl" 
            :alt="c.CompanyName" 
            class="w-full h-full object-cover" 
        />
        
        <span v-else>
            {{ c.CompanyName.charAt(0).toUpperCase() }}
        </span>
        </div>

        <div>
          <div class="text-sm font-semibold text-slate-700">
            {{ c.CompanyName }}
          </div>
          <div class="text-xs text-slate-400">
            {{ c.City }}
          </div>
        </div>
      </div>

      <div v-if="useCompany.listCompany.length === 0" class="p-6 text-center text-sm text-slate-400">
        Không có dữ liệu
      </div>
    </div>
  </div>
</div>

<!-- POSITION -->
<div class="space-y-2">
  <label class="text-sm font-semibold text-slate-700">
    Vị trí của bạn <span class="text-red-500">*</span>
  </label>

  <input 
    v-model="joinForm.Position"
    type="text"
    required
    class="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm"
    placeholder="Ví dụ: Frontend Developer, HR..."
  />
</div>

<!-- BUTTON -->
<button 
  type="submit"
  class="w-full py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 shadow-md hover:shadow-lg transition active:scale-[0.98]"
>
  Gửi yêu cầu gia nhập
</button>

</form>
  
          </div>
        </div>
      </div>
    </div>
  </template>