<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Search, Plus, ChevronRight } from 'lucide-vue-next';
import SearchJob from './SearchJob.vue';
import { useJobStore } from '../stores/job';
import type { IJob } from '../types/job';

const jobStore = useJobStore();

const categories = [
  { name: 'Kế toán' },
  { name: 'Việc làm thời gian' },
  { name: 'Hành chính - Văn...' },
  { name: 'IT phần mềm' },
  { name: 'Xây dựng' },
];

const searchQuery = ref('');
const searchResults = ref<IJob[]>([]);
const showSidebar = ref(false);
const isSearching = ref(false);
const currentKeyword = ref('');

// Canvas snowflake refs
const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationId: number;

const handleSearch = async (keywordToSearch?: string) => {
  const query = typeof keywordToSearch === 'string' ? keywordToSearch : searchQuery.value;
  if (!query.trim()) return;

  showSidebar.value = true;
  isSearching.value = true;
  currentKeyword.value = query;

  try {
    await jobStore.fetchJobSearch(query);
    searchResults.value = jobStore.listJobSearch;
  } catch (error) {
    console.error('Lỗi tìm kiếm:', error);
  } finally {
    isSearching.value = false;
  }
};

// ---- Snowflake animation ----
interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  drift: number;
  driftSpeed: number;
  angle: number;
}

const initSnow = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const resize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const count = 60;
  const flakes: Snowflake[] = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 3.5 + 1,
    speed: Math.random() * 0.8 + 0.3,
    opacity: Math.random() * 0.5 + 0.3,
    drift: Math.random() * 2 - 1,
    driftSpeed: Math.random() * 0.01 + 0.003,
    angle: Math.random() * Math.PI * 2,
  }));

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    flakes.forEach((f) => {
      // Draw a 6-pointed snowflake
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.angle);
      ctx.globalAlpha = f.opacity;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = f.radius * 0.4;
      ctx.lineCap = 'round';

      for (let i = 0; i < 6; i++) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, f.radius * 2.5);
        // small branches
        ctx.moveTo(0, f.radius * 1.2);
        ctx.lineTo(f.radius * 0.7, f.radius * 0.5);
        ctx.moveTo(0, f.radius * 1.2);
        ctx.lineTo(-f.radius * 0.7, f.radius * 0.5);
        ctx.stroke();
      }

      ctx.restore();

      // Move
      f.y += f.speed;
      f.angle += f.driftSpeed;
      f.x += Math.sin(f.angle) * f.drift;

      if (f.y > canvas.height + 10) {
        f.y = -10;
        f.x = Math.random() * canvas.width;
      }
      if (f.x < -10) f.x = canvas.width + 10;
      if (f.x > canvas.width + 10) f.x = -10;
    });

    animationId = requestAnimationFrame(draw);
  };

  draw();
};

onMounted(() => {
  initSnow();
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
});
</script>

<template>
  <section class="relative bg-[#4c5bd4] pt-10 pb-16 px-4 overflow-hidden">
    <!-- Snow canvas -->
    <canvas
      ref="canvasRef"
      class="absolute inset-0 w-full h-full pointer-events-none"
      style="z-index: 0;"
    />

    <!-- Content layer -->
    <div class="max-w-6xl mx-auto relative" style="z-index: 1;">

      <h1 class="text-white text-xl md:text-2xl font-bold mb-6">
        Tìm việc làm nhanh – Hàng ngàn cơ hội việc làm mới trên toàn quốc
      </h1>

      <div class="flex items-center gap-3 mb-8">
        <div class="flex flex-1 bg-white rounded-full p-1 shadow-md items-center">
          <div class="flex items-center flex-[2] px-4 gap-2 border-r border-gray-200">
            <Search class="text-gray-500 w-5 h-5" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm bất cứ thứ gì liên quan đến công việc mà bạn muốn..."
              class="w-full py-2.5 outline-none text-sm"
              @keyup.enter="handleSearch()"
            />
          </div>
          <button
            class="bg-[#f1f864] hover:bg-yellow-300 text-gray-800 font-bold py-2.5 px-8 rounded-full transition-all text-sm"
            @click="handleSearch()"
          >
            Tìm kiếm
          </button>
        </div>

        <button class="bg-[#89a3f5] hover:bg-blue-400 p-2.5 rounded-md text-white shadow-sm transition-all">
          <Plus class="w-6 h-6" />
        </button>
      </div>

      <div class="flex flex-col md:flex-row gap-4">

        <div class="w-full md:w-64 bg-white rounded-lg shadow-lg overflow-hidden">
          <ul class="py-2">
            <li
              v-for="cat in categories"
              :key="cat.name"
              class="flex items-center justify-between px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 group"
            >
              <span class="text-sm font-medium text-gray-700 group-hover:text-blue-600">{{ cat.name }}</span>
              <ChevronRight class="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
            </li>
          </ul>
        </div>

        <div class="flex-1 bg-[#d9d9d9] rounded-lg min-h-[250px] flex items-center justify-center">
          <p class="text-gray-500 italic">Banner Slide Placeholder</p>
        </div>

      </div>
    </div>
  </section>

  <SearchJob
    v-if="showSidebar"
    :jobs="searchResults"
    :loading="isSearching"
    :keyword="currentKeyword"
    @close="showSidebar = false"
    @search="handleSearch"
    @view-job=""
  />
</template>

<style scoped>
select {
  background-image: none;
}
</style>