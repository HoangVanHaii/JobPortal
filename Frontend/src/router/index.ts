import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import RegisterView from '../views/RegisterView.vue'
import VerifyOtp from '../components/VerifyOtp.vue'
import PasswordForm from '../components/PasswordForm.vue'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import JobDetailView from '../views/JobDetailView.vue'

const routes: Array<RouteRecordRaw> = [
    { path: '/', redirect: '/home' },
    { path: '/request-otp', name: 'request-otp', component: RegisterView },
    { path: '/verify-otp', name: 'verify-otp', component: VerifyOtp },
    { path: '/register', name: 'register', component: PasswordForm },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/home', name: 'home', component: HomeView },
    { path: '/job-detail/:id', name: 'job-detail', component: JobDetailView }

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router