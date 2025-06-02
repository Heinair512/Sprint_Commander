<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  missionTitle: string;
  score: number;
  level: string;
}>();

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
  <header class="header-bar p-2 bg-crt-sepia text-crt-darkbrown border-b-4 border-crt-darkbrown flex items-center justify-between">
    <div class="flex items-center space-x-4 relative">
      <button class="burger-menu p-1" @click="toggleMenu">
        <div class="w-6 h-0.5 bg-crt-darkbrown mb-1"></div>
        <div class="w-6 h-0.5 bg-crt-darkbrown mb-1"></div>
        <div class="w-6 h-0.5 bg-crt-darkbrown"></div>
      </button>
      
      <!-- Burger Menu Dropdown -->
      <div v-if="showMenu" class="absolute top-full left-0 mt-2 w-48 bg-crt-sepia border-2 border-crt-darkbrown rounded shadow-lg z-50">
        <button 
          @click="handleShowTips" 
          class="w-full text-left px-4 py-2 hover:bg-crt-brown hover:text-crt-lightsep transition-colors duration-200"
        >
          📚 Tipps
        </button>
        <button 
          @click="handleLogout" 
          class="w-full text-left px-4 py-2 hover:bg-crt-brown hover:text-crt-lightsep transition-colors duration-200"
        >
          🚪 Logout
        </button>
      </div>
      
      <div class="mission-title text-xs md:text-sm flex flex-col items-start">
        <span>Mission:</span>
        <span>{{ missionTitle }}</span>
      </div>
    </div>
    
    <div class="game-title text-center text-lg md:text-xl font-bold tracking-wider">
      SPRINT COMMANDER
    </div>
    
    <div class="score-level text-right text-xs md:text-sm">
      <div class="score transition-colors duration-500">Score: {{ score }}</div>
      <div>Level: {{ level }}</div>
    </div>
  </header>
</template>

<style scoped>
.header-bar {
  font-family: 'Press Start 2P', monospace;
  image-rendering: pixelated;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.game-title {
  color: #5c4321;
  text-shadow: 2px 2px 0px rgba(252, 239, 180, 0.4);
}

.mission-title {
  line-height: 1.5;
}

.score {
  position: relative;
}

.score.success {
  color: #90EE90;
}

.score.error {
  color: #8B0000;
}

.burger-menu {
  cursor: pointer;
  transition: transform 0.2s;
}

.burger-menu:hover {
  transform: scale(1.1);
}
</style>