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
  <header class="header-bar p-4 bg-crt-surface border-b-4 border-crt-primary flex items-center justify-between">
    <div class="flex items-center space-x-6">
      <button 
        class="burger-menu p-2 hover:bg-crt-primary/20 rounded transition-colors" 
        @click="toggleMenu"
      >
        <div class="w-6 h-0.5 bg-crt-glow mb-1"></div>
        <div class="w-6 h-0.5 bg-crt-glow mb-1"></div>
        <div class="w-6 h-0.5 bg-crt-glow"></div>
      </button>
      
      <div v-if="showMenu" class="absolute top-full left-4 mt-2 w-48 bg-crt-surface border-2 border-crt-primary rounded shadow-glow z-50">
        <button 
          @click="handleShowTips" 
          class="w-full text-left px-4 py-2 hover:bg-crt-primary/20 transition-colors duration-200"
        >
          📚 Tipps
        </button>
        <button 
          @click="handleLogout" 
          class="w-full text-left px-4 py-2 hover:bg-crt-primary/20 transition-colors duration-200"
        >
          🚪 Logout
        </button>
      </div>
      
      <div class="mission-info flex flex-col items-start">
        <span class="text-crt-muted text-xs">Mission:</span>
        <span class="text-crt-glow text-sm">{{ missionTitle }}</span>
      </div>
    </div>
    
    <div class="game-title text-center text-xl font-bold tracking-wider text-crt-primary">
      SPRINT COMMANDER
    </div>
    
    <div class="stats flex flex-col items-end gap-3">
      <div class="flex items-center gap-4">
        <div class="score text-crt-glow">Score: {{ score }}</div>
        <div class="level text-crt-secondary">{{ level }}</div>
      </div>
      
      <div class="metrics flex flex-col gap-2">
        <div class="metric-bar">
          <div class="flex justify-between mb-1">
            <span class="text-crt-accent">🎯 Outcome</span>
            <span class="text-crt-glow">{{ scoreStore.getCurrentOutcome }}%</span>
          </div>
          <div class="w-32 h-2 bg-crt-muted/20 rounded">
            <div 
              class="h-full rounded transition-all duration-300"
              :style="{ width: `${scoreStore.getCurrentOutcome}%` }"
              :class="{
                'bg-crt-success': scoreStore.getCurrentOutcome >= 75,
                'bg-crt-warning': scoreStore.getCurrentOutcome >= 50 && scoreStore.getCurrentOutcome < 75,
                'bg-crt-error': scoreStore.getCurrentOutcome < 50
              }"
            ></div>
          </div>
        </div>
        
        <div class="metric-bar">
          <div class="flex justify-between mb-1">
            <span class="text-crt-accent">⚡️ Burden</span>
            <span class="text-crt-glow">{{ scoreStore.getCurrentBurden }}%</span>
          </div>
          <div class="w-32 h-2 bg-crt-muted/20 rounded">
            <div 
              class="h-full rounded transition-all duration-300"
              :style="{ width: `${scoreStore.getCurrentBurden}%` }"
              :class="{
                'bg-crt-error': scoreStore.getCurrentBurden > 75,
                'bg-crt-warning': scoreStore.getCurrentBurden > 50 && scoreStore.getCurrentBurden <= 75,
                'bg-crt-success': scoreStore.getCurrentBurden <= 50
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
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.game-title {
  text-shadow: 0 0 10px theme('colors.crt.primary');
}

.mission-info {
  line-height: 1.5;
}

.score {
  position: relative;
}

.score.success {
  color: theme('colors.crt.success');
}

.score.error {
  color: theme('colors.crt.error');
}

.burger-menu {
  cursor: pointer;
  transition: transform 0.2s;
}

.burger-menu:hover {
  transform: scale(1.1);
}

.stats {
  min-width: 160px;
}

.metric-bar {
  font-size: 0.6rem;
}
</style>