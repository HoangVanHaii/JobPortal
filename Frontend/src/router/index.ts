import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import RegisterView from '../views/RegisterView.vue'
import VerifyOtp from '../components/VerifyOtp.vue'
import PasswordForm from '../components/PasswordForm.vue'
import LoginView from '../views/LoginView.vue'
import Footer from '../components/Footer.vue'

const routes: Array<RouteRecordRaw> = [
    { path: '/', redirect: '/register' },
    { path: '/request-otp', name: 'request-otp', component: RegisterView },
    { path: '/verify-otp', name: 'verify-otp', component: VerifyOtp },
    { path: '/register', name: 'register', component: PasswordForm },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/footer', name: 'footer', component: Footer }

  
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router