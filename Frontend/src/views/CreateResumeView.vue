<template>
    <Notify  
      v-if="showNotify" 
      :message="messageNotify" 
      :isSuccess="isSuccessNotify" 
      @close="showNotify = false"
    />
  
    <div class="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div class="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        
        <div class="bg-blue-600/5 p-8 border-b border-slate-100 text-center">
          <h2 class="text-2xl font-bold text-blue-700 uppercase tracking-wide">Tạo hồ sơ ứng viên (CV)</h2>
          <p class="text-slate-500 mt-2 text-sm">Vui lòng điền đầy đủ thông tin để xây dựng bản CV chuyên nghiệp nhất.</p>
        </div>
  
        <div class="p-8 sm:p-10">
          <form @submit.prevent="handleSubmit" class="space-y-10">
  
            <section>
              <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
                <i class="fas fa-user-circle text-blue-600"></i> Thông tin chung
              </h3>
              <div class="space-y-5">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Tiêu đề CV (Vị trí ứng tuyển) <span class="text-red-500">*</span></label>
                  <input v-model="resumeForm.title" type="text" required class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm" placeholder="Ví dụ: Lập trình viên Frontend (VueJS)">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Tóm tắt bản thân</label>
                  <textarea v-model="resumeForm.summary" rows="3" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm resize-none" placeholder="Giới thiệu ngắn gọn về mục tiêu nghề nghiệp và điểm mạnh của bạn..."></textarea>
                </div>
              </div>
            </section>
  
            <section>
              <div class="flex justify-between items-center mb-4 border-b pb-2">
                <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <i class="fas fa-tools text-blue-600"></i> Kỹ năng chuyên môn
                </h3>
                <button type="button" @click="addItem('skills')" class="text-sm text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1 transition-colors">
                  <i class="fas fa-plus-circle"></i> Thêm kỹ năng
                </button>
              </div>
              
              <div class="space-y-4">
                <div v-for="(skill, index) in resumeForm.skills" :key="index" class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-100 relative group animate-in fade-in zoom-in-95 duration-200">
                  <div class="md:col-span-6">
                    <label class="block text-xs font-semibold text-slate-500 mb-1">Tên kỹ năng <span class="text-red-500">*</span></label>
                    <input v-model="skill.skillName" type="text" required class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm" placeholder="Ví dụ: JavaScript, VueJS...">
                  </div>
                  <div class="md:col-span-5">
                    <label class="block text-xs font-semibold text-slate-500 mb-1">Trình độ <span class="text-red-500">*</span></label>
                    <select v-model="skill.level" required class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm cursor-pointer">
                      <option value="" disabled>-- Chọn mức độ --</option>
                      <option value="Cơ bản">Cơ bản</option>
                      <option value="Khá">Khá</option>
                      <option value="Tốt">Tốt</option>
                      <option value="Xuất sắc">Xuất sắc</option>
                    </select>
                  </div>
                  <div class="md:col-span-1 flex justify-end mt-6">
                    <button type="button" @click="removeItem('skills', index)" class="text-red-400 hover:text-red-600 p-2 transition-colors" title="Xóa">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            </section>
  
            <section>
              <div class="flex justify-between items-center mb-4 border-b pb-2">
                <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <i class="fas fa-graduation-cap text-blue-600"></i> Học vấn
                </h3>
                <button type="button" @click="addItem('education')" class="text-sm text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1 transition-colors">
                  <i class="fas fa-plus-circle"></i> Thêm trường học
                </button>
              </div>
              
              <div class="space-y-6">
                <div v-for="(edu, index) in resumeForm.education" :key="index" class="bg-slate-50 p-5 rounded-xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
                  <button type="button" @click="removeItem('education', index)" class="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors"><i class="fas fa-times text-lg"></i></button>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4 mt-2">
                    <div>
                      <label class="block text-sm font-semibold text-slate-700 mb-2">Trường / Trung tâm <span class="text-red-500">*</span></label>
                      <input v-model="edu.institution" type="text" required class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-sm" placeholder="Ví dụ: Đại học Bách Khoa">
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-slate-700 mb-2">Chuyên ngành <span class="text-red-500">*</span></label>
                      <input v-model="edu.major" type="text" required class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-sm" placeholder="Ví dụ: Công nghệ thông tin">
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label class="block text-sm font-semibold text-slate-700 mb-2">Bằng cấp <span class="text-red-500">*</span></label>
                      <input v-model="edu.degree" type="text" required class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-sm" placeholder="Ví dụ: Cử nhân">
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-slate-700 mb-2">Ngày bắt đầu <span class="text-red-500">*</span></label>
                      <input v-model="edu.startDate" type="date" required class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-slate-700 mb-2">Ngày kết thúc</label>
                      <input v-model="edu.endDate" type="date" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm">
                    </div>
                  </div>
                </div>
              </div>
            </section>
  
            <section>
              <div class="flex justify-between items-center mb-4 border-b pb-2">
                <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <i class="fas fa-briefcase text-blue-600"></i> Kinh nghiệm làm việc
                </h3>
                <button type="button" @click="addItem('experience')" class="text-sm text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1 transition-colors">
                  <i class="fas fa-plus-circle"></i> Thêm công ty
                </button>
              </div>
              
              <div class="space-y-6">
                <div v-for="(exp, index) in resumeForm.experience" :key="index" class="bg-slate-50 p-5 rounded-xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
                  <button type="button" @click="removeItem('experience', index)" class="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors"><i class="fas fa-times text-lg"></i></button>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4 mt-2">
                    <div>
                      <label class="block text-sm font-semibold text-slate-700 mb-2">Tên công ty <span class="text-red-500">*</span></label>
                      <input v-model="exp.companyName" type="text" required class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm" placeholder="Ví dụ: Công ty TNHH ABC">
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-slate-700 mb-2">Vị trí công việc <span class="text-red-500">*</span></label>
                      <input v-model="exp.position" type="text" required class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm" placeholder="Ví dụ: Frontend Developer">
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                    <div>
                      <label class="block text-sm font-semibold text-slate-700 mb-2">Ngày bắt đầu <span class="text-red-500">*</span></label>
                      <input v-model="exp.startDate" type="date" required class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm">
                    </div>
                    <div v-if="!exp.isCurrent">
                      <label class="block text-sm font-semibold text-slate-700 mb-2">Ngày kết thúc</label>
                      <input v-model="exp.endDate" type="date" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm">
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <label class="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer w-fit">
                      <input v-model="exp.isCurrent" type="checkbox" class="w-4 h-4 text-blue-600 rounded border-slate-300">
                      Tôi đang làm việc tại đây
                    </label>
                  </div>
  
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Mô tả công việc</label>
                    <textarea v-model="exp.description" rows="3" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm resize-none" placeholder="Mô tả các nhiệm vụ và thành tựu của bạn..."></textarea>
                  </div>
                </div>
              </div>
            </section>
  
            <section>
              <div class="flex justify-between items-center mb-4 border-b pb-2">
                <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <i class="fas fa-project-diagram text-blue-600"></i> Dự án nổi bật
                </h3>
                <button type="button" @click="addItem('projects')" class="text-sm text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1 transition-colors">
                  <i class="fas fa-plus-circle"></i> Thêm dự án
                </button>
              </div>
              
              <div class="space-y-6">
                <div v-for="(project, index) in resumeForm.projects" :key="index" class="bg-slate-50 p-5 rounded-xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
                  <button type="button" @click="removeItem('projects', index)" class="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors"><i class="fas fa-times text-lg"></i></button>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4 mt-2">
                    <div>
                      <label class="block text-sm font-semibold text-slate-700 mb-2">Tên dự án <span class="text-red-500">*</span></label>
                      <input v-model="project.projectName" type="text" required class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm" placeholder="Ví dụ: Hệ thống quản lý ERP">
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-slate-700 mb-2">Vai trò <span class="text-red-500">*</span></label>
                      <input v-model="project.role" type="text" required class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm" placeholder="Ví dụ: Team Leader">
                    </div>
                  </div>
  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                    <div>
                      <label class="block text-sm font-semibold text-slate-700 mb-2">Công nghệ sử dụng <span class="text-red-500">*</span> <span class="font-normal text-xs text-slate-400">(Cách nhau bởi dấu phẩy)</span></label>
                      <input v-model="project.techString" type="text" required class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm" placeholder="Ví dụ: VueJS, NodeJS, MongoDB">
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-slate-700 mb-2">Link dự án (Nếu có)</label>
                      <input v-model="project.link" type="url" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm" placeholder="https://...">
                    </div>
                  </div>
  
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Mô tả dự án</label>
                    <textarea v-model="project.description" rows="3" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm resize-none" placeholder="Mô tả ngắn về dự án..."></textarea>
                  </div>
                </div>
              </div>
            </section>
  
            <div class="pt-8 border-t border-slate-200 flex flex-col items-center">
              <h4 class="text-blue-900 font-bold text-lg mb-6 text-center">Hoàn thiện hồ sơ của bạn</h4>
              
              <div class="flex flex-col sm:flex-row w-full max-w-xl gap-4 justify-center">
                <button type="submit" class="flex-1 bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold py-4 px-6 rounded-full transition-all flex justify-center items-center gap-2">
                  <i class="fas fa-edit"></i> Lưu CV Online
                </button>
                <button type="button" class="flex-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 font-bold py-4 px-6 rounded-full transition-all flex justify-center items-center gap-2">
                  <i class="fas fa-file-pdf"></i> Xuất file PDF
                </button>
              </div>
            </div>
  
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  // Import Notify component của bạn
  import Notify from '../components/Notify.vue';
  import  type{ iResumeDetail, FormState } from '../types/resume';
  // ============================================
  // STATE THÔNG BÁO (NOTIFY)
  // ============================================
  const showNotify = ref(false);
  const messageNotify = ref('');
  const isSuccessNotify = ref(true);
  
  // Hàm Helper để gọi thông báo nhanh gọn
  const showToast = (message: string, isSuccess: boolean) => {
    messageNotify.value = message;
    isSuccessNotify.value = isSuccess;
    showNotify.value = true;
    
    // Tự động tắt sau 3 giây (nếu Notify component của bạn chưa tự xử lý)
    setTimeout(() => {
      showNotify.value = false;
    }, 3000);
  };
  
  // ============================================
  // INTERFACES
  // ============================================
  
  
  type ArraySection = 'skills' | 'experience' | 'education' | 'projects';
  
  // ============================================
  // STATE DỮ LIỆU FORM
  // ============================================
  const resumeForm = ref<FormState>({
    candidateId: 0, 
    title: '',
    summary: '',
    skills: [{ skillName: '', level: '' }],
    experience: [{ companyName: '', position: '', startDate: '', endDate: '', isCurrent: false, description: '' }],
    education: [{ institution: '', degree: '', major: '', startDate: '', endDate: '', gpa: '' }],
    projects: [{ projectName: '', role: '', techString: '', link: '', description: '' }]
  });
  
  // ============================================
  // LOGIC XỬ LÝ MẢNG ĐỘNG
  // ============================================
  const isLastItemValid = (section: ArraySection): boolean => {
    const list = resumeForm.value[section] as any[];
    if (list.length === 0) return true; 
  
    const lastItem = list[list.length - 1];
  
    switch (section) {
      case 'skills':
        return !!(lastItem.skillName.trim() && lastItem.level);
      case 'experience':
        return !!(lastItem.companyName.trim() && lastItem.position.trim() && lastItem.startDate);
      case 'education':
        return !!(lastItem.institution.trim() && lastItem.major.trim() && lastItem.degree.trim() && lastItem.startDate);
      case 'projects':
        return !!(lastItem.projectName.trim() && lastItem.role.trim() && lastItem.techString.trim());
      default:
        return true;
    }
  };
  
  const addItem = (section: ArraySection) => {
    if (!isLastItemValid(section)) {
      // Đã thay thế alert bằng showToast (báo lỗi màu đỏ)
      showToast('Vui lòng điền đủ thông tin bắt buộc ở ô hiện tại trước khi thêm mới!', false);
      return;
    }
  
    if (section === 'skills') {
      resumeForm.value.skills.push({ skillName: '', level: '' });
    } else if (section === 'experience') {
      resumeForm.value.experience.push({ companyName: '', position: '', startDate: '', endDate: '', isCurrent: false, description: '' });
    } else if (section === 'education') {
      resumeForm.value.education.push({ institution: '', degree: '', major: '', startDate: '', endDate: '', gpa: '' });
    } else if (section === 'projects') {
      resumeForm.value.projects.push({ projectName: '', role: '', techString: '', link: '', description: '' });
    }
  };
  
  const removeItem = (section: ArraySection, index: number) => {
    // @ts-ignore
    resumeForm.value[section].splice(index, 1);
  };
  
  // ============================================
  // LOGIC SUBMIT (GỌI API)
  // ============================================
  const handleSubmit = async () => {
    try {
      const processedExperience = resumeForm.value.experience.map(exp => {
        const result = { ...exp };
        if (result.isCurrent) {
          result.endDate = undefined; 
        }
        return result;
      });
  
      const payload: iResumeDetail = {
        ...resumeForm.value,
        experience: processedExperience,
        projects: resumeForm.value.projects.map(p => ({
          projectName: p.projectName,
          role: p.role,
          link: p.link || undefined,
          description: p.description || undefined,
          technologies: p.techString 
            ? p.techString.split(',')
                .map(tech => tech.trim())
                .filter(tech => tech.length > 0) 
            : []
        }))
      };
  
      console.log("🚀 Payload gửi lên Backend cực sạch:", payload);
  
      // ============================================
      // GỌI API Ở ĐÂY
      // const response = await axios.post('/api/resume', payload);
      // ============================================
  
      // Bật thông báo thành công sau khi gọi API xong
      showToast("Đã lưu CV thành công!", true);
  
    } catch (error) {
      console.error("Lỗi khi xử lý form:", error);
      showToast("Có lỗi xảy ra, vui lòng thử lại sau!", false);
    }
  };
  </script>