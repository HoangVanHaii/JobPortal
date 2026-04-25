import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import RegisterView from '../views/RegisterView.vue'
import VerifyOtp from '../components/VerifyOtp.vue'
import PasswordForm from '../components/PasswordForm.vue'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import JobDetailView from '../views/JobDetailView.vue'
import Footer from '../components/Footer.vue'
import LoginSectionView from '../views/LoginSectionView.vue'
import RegisterSectionView from '../views/RegisterSectionView.vue'
import RegisterEmployer from '../views/RegisterCompany.vue'
import CreateResumeView from '../views/CreateResumeView.vue'
import SidebarEmployer from '../components/SidebarEmployer.vue'



//
import CreateJobView from '../views/CreateJobView.vue'
import PostedJobsView from '../views/PostedJobsView.vue'
import JobApplicationView from '../views/JobApplicationView.vue'
import ApplicationsView from '../views/ApplicationsView.vue'
//

const routes: Array<RouteRecordRaw> = [
    { path: '/', redirect: '/home' },
    { path: '/request-otp', name: 'request-otp', component: RegisterView },
    { path: '/verify-otp', name: 'verify-otp', component: VerifyOtp },
    { path: '/register', name: 'register', component: PasswordForm },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/home', name: 'home', component: HomeView },
    { path: '/job-detail/:id', name: 'job-detail', component: JobDetailView }

    { path: '/footer', name: 'footer', component: Footer },
    { path: '/login-section', name: 'login-section', component: LoginSectionView },
    { path: '/register-section', name: 'register-section', component: RegisterSectionView },
    { path: '/register-employer', name: 'register-employer', component: RegisterEmployer },
    { path: '/create-resume', name: 'create-resume', component: CreateResumeView },
    { path: '/sidebar-employer', name: 'sidebar-employer', component: SidebarEmployer },


    { path: '/create-job', name: 'create-job', component: CreateJobView },
    { path: '/posted-jobs', name: 'posted-jobs', component: PostedJobsView },
    { path: '/job-applications', name: 'job-applications', component: JobApplicationView },
    { path: '/applications', name: 'applications', component: ApplicationsView }
  
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router