<template>
    <div class="min-h-screen flex flex-col bg-slate-50">
        <Header />

        <main class="flex-grow">
            <router-view />
        </main>

        <Footer />
  </div>
</template>
<script setup lang="ts">
import Footer from './components/Footer.vue';
</script>