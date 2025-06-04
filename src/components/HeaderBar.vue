<script setup lang="ts">
import { ref } from 'vue';
import { useScoreStore } from '../stores/scoreStore';

const props = defineProps<{
  missionTitle: string;
  score: number;
  level: string;
}>();

const scoreStore = useScoreStore();
const emit = defineEmits(['logout', 'showTips']);
const showMenu = ref(false);

const handleLogout = () => {
  emit('logout');
};

const handleShowTips = () => {
  emit('showTips');
  showMenu.value = false;
};

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};
</script>

<template>
  <header class="header-bar h-12 px-4 bg-crt-sepia text-crt-darkbrown border-b-2 border-crt-darkbrown flex items-center justify-between">
    <!-- Left Section -->
    <div class="flex items-center gap-4">
      <div class="relative">
        <button class="burger-menu p-1" @click="toggleMenu">
          <div class="w-4 h-0.5 bg-crt-darkbrown mb-1"></div>
          <div class="w-4 h-0.5 bg-crt-darkbrown mb-1"></div>
          <div class="w-4 h-0.5 bg-crt-darkbrown"></div>
        </button>
        
        <div v-if="showMenu" class="absolute top-full left-0 mt-1 w-48 bg-crt-sepia border border-crt-darkbrown rounded shadow-lg z-50">
          <button 
            @click="handleShowTips" 
            class="w-full text-left px-3 py-2 text-xs hover:bg-crt-brown hover:text-crt-lightsep transition-colors duration-200"
          >
            📚 Tipps
          </button>
          <button 
            @click="handleLogout" 
            class="w-full text-left px-3 py-2 text-xs hover:bg-crt-brown hover:text-crt-lightsep transition-colors duration-200"
          >
            🚪 Logout
          </button>
        </div>
      </div>
      
      <div class="mission-title text-xs">
        <span class="opacity-70">Mission:</span>
        <span class="ml-1">{{ missionTitle }}</span>
      </div>
    </div>

    <!-- Center Section -->
    <div class="game-title text-sm font-bold tracking-wider absolute left-1/2 transform -translate-x-1/2">
      SPRINT COMMANDER
    </div>

    <!-- Right Section -->
    <div class="flex items-center gap-6 text-xs">
      <div class="flex items-center gap-3">
        <div class="score transition-colors duration-500">{{ score }}</div>
        <div class="opacity-70">{{ level }}</div>
      </div>
      
      <div class="flex gap-4">
        <div class="metric-bar w-24">
          <div class="flex justify-between text-[10px]">
            <span>🎯</span>
            <span>{{ scoreStore.getCurrentOutcome }}%</span>
          </div>
          <div class="h-1 bg-gray-200 rounded-full">
            <div 
              class="h-full rounded-full transition-all duration-300"
              :style="{ width: `${scoreStore.getCurrentOutcome}%` }"
              :class="{
                'bg-green-600': scoreStore.getCurrentOutcome >= 75,
                'bg-yellow-500': scoreStore.getCurrentOutcome >= 50 && scoreStore.getCurrentOutcome < 75,
                'bg-red-600': scoreStore.getCurrentOutcome < 50
              }"
            ></div>
          </div>
        </div>
        
        <div class="metric-bar w-24">
          <div class="flex justify-between text-[10px]">
            <span>⚡️</span>
            <span>{{ scoreStore.getCurrentBurden }}%</span>
          </div>
          <div class="h-1 bg-gray-200 rounded-full">
            <div 
              class="h-full rounded-full transition-all duration-300"
              :style="{ width: `${scoreStore.getCurrentBurden}%` }"
              :class="{
                'bg-red-600': scoreStore.getCurrentBurden > 75,
                'bg-yellow-500': scoreStore.getCurrentBurden > 50 && scoreStore.getCurrentBurden <= 75,
                'bg-green-600': scoreStore.getCurrentBurden <= 50
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header-bar {
  font-family: 'Press Start 2P', monospace;
  image-rendering: pixelated;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
}

.game-title {
  color: #5c4321;
  text-shadow: 1px 1px 0px rgba(252, 239, 180, 0.4);
}

.burger-menu {
  cursor: pointer;
  transition: transform 0.2s;
}

.burger-menu:hover {
  transform: scale(1.1);
}

.score.success {
  color: #90EE90;
}

.score.error {
  color: #8B0000;
}

@media (max-width: 768px) {
  .game-title {
    display: none;
  }
  
  .metric-bar {
    width: 4rem;
  }
}

@media (max-width: 640px) {
  .mission-title span:first-child {
    display: none;
  }
  
  .metric-bar {
    width: 3rem;
  }
}
</style>