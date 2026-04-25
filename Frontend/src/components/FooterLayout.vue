<template>
    <div class="footer-only-layout">
      <main>
        <router-view /> </main>
      
      <Footer />
    </div>
  </template>
  
  <script setup>
  import Footer from '../components/Footer.vue';
  </script>