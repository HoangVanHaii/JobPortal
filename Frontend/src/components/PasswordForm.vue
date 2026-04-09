<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const password = ref<string>('');
const confirmPassword = ref<string>('');
const useAuth = useAuthStore();
    
const isValid = computed(() => {
    return password.value.length >= 6 && password.value === confirmPassword.value;
})
const computedMessage = computed(() => {
    if(password.value.length > 0 && password.value.length < 6) {
        return 'Mật khâu phải có ít nhất 6 ký tự!';
    }
    if( password.value && confirmPassword.value !== '' && password.value !== confirmPassword.value) {
        return 'Mật khẩu không khớp!';
    }
    return '';
})
const handleSubmit = async () => {
    if (!isValid.value) {
        return;
    }
    const verifyToken = useAuth.verifyToken;
    if(!verifyToken) {
        return;
    }
    const role = sessionStorage.getItem('role');
    await useAuth.registerStore(verifyToken, password.value, role || 'Candidate');
    if (!useAuth.error) {
        successForm();
    }
    
}   
const emit = defineEmits(['close', 'success']);
const closeForm = () => {
    emit('close');
}
const successForm = () => {
    emit('success');
}
</script>

<template>
    <div @click="closeForm" class="fixed inset-0 z-50 min-h-screen bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div @click.stop class="flex flex-col bg-white px-8 py-10 gap-4 items-center rounded-lg shadow-md w-full max-w-lg">
            <h2 class="text-blue-700 text-2xl font-semibold mb-4">ĐĂNG KÝ TÀI KHOẢN</h2>
            <div class="flex justify-center gap-6">
                <div class="flex flex-col gap-1">
                    <p class="text-sm font-medium">Mật khẩu <span class="text-red-500">*</span></p>
                    <input 
                        type="password" 
                        v-model="password"
                        placeholder="Nhập mật khẩu"
                        class="w-full border rounded-md p-2 outline-none focus:ring-blue-900 focus:ring-1"
                    >
                </div>
                <div class="flex flex-col">
                    <p>Nhập lại mật khẩu <span class="text-red-500">*</span></p>
                    <input 
                        type="password" 
                        v-model="confirmPassword"
                        placeholder="Nhập lại mật khẩu"
                        class="w-full border rounded-md p-2 outline-none focus:ring-blue-900 focus:ring-1"
                    >
                </div>
            </div>
            <div class="h-3">
                <p v-if="computedMessage" class="text-red-500 text-sm">{{ computedMessage }}</p>
            </div>
            <div class="flex justify-center items-center">
                <button
                @click="handleSubmit"
                :disabled="useAuth.loading || !isValid"
                :class="['w-full py-2 px-6 rounded-md font-semibold text-white transition',
                    (!useAuth.loading && isValid) ? 'bg-blue-700 cursor-pointer hover:bg-blue-800' : 'bg-gray-400 cursor-not-allowed']"
                >
                    <i v-if="useAuth.loading" class="fa fa-spinner fa-spin mr-2"></i>
                    {{ useAuth.loading ? 'Đang xử lý...' : 'Đăng ký' }}
                </button>
            </div>

        </div>
    </div>

</template>