<script setup lang="ts">
import { ref, computed } from 'vue';
import { useScoreStore } from '../stores/scoreStore';

defineProps<{
  missionTitle: string;
  score: number;
  level: string;
}>();

const scoreStore = useScoreStore();
const emit = defineEmits(['logout', 'showTips', 'navigate']);
const showMenu = ref(false);

const handleLogout = () => {
  emit('logout');
};

const handleShowTips = () => {
  emit('showTips');
  showMenu.value = false;
};

const handleNavigate = (screen: 'workspace' | 'game') => {
  emit('navigate', screen);
  showMenu.value = false;
};

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const wmt = computed(() => scoreStore.getWMTPercentage);
const wmtClass = computed(() => {
  if (wmt.value >= 90) return 'bg-red-600';
  if (wmt.value >= 75) return 'bg-yellow-500';
  return 'bg-green-600';
});
</script>

<template>
  <header class="header-bar p-2 bg-crt-sepia text-crt-darkbrown border-b-4 border-crt-darkbrown">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4 relative">
        <button class="burger-menu p-1" @click="toggleMenu">
          <div class="w-6 h-0.5 bg-crt-darkbrown mb-1"></div>
          <div class="w-6 h-0.5 bg-crt-darkbrown mb-1"></div>
          <div class="w-6 h-0.5 bg-crt-darkbrown"></div>
        </button>
        
        <div v-if="showMenu" class="absolute top-full left-0 mt-2 w-56 bg-crt-sepia border-2 border-crt-darkbrown rounded shadow-lg z-50">
          <button 
            @click="handleNavigate('workspace')" 
            class="w-full text-left px-4 py-2 hover:bg-crt-brown hover:text-crt-lightsep transition-colors duration-200 flex items-center"
          >
            <span class="mr-2">💻</span> Work
          </button>
          <button 
            @click="handleNavigate('game')" 
            class="w-full text-left px-4 py-2 hover:bg-crt-brown hover:text-crt-lightsep transition-colors duration-200 flex items-center"
          >
            <span class="mr-2">🎮</span> Events
          </button>
          <button 
            @click="handleShowTips" 
            class="w-full text-left px-4 py-2 hover:bg-crt-brown hover:text-crt-lightsep transition-colors duration-200 flex items-center"
          >
            <span class="mr-2">📚</span> Tipps
          </button>
          <button 
            @click="handleLogout" 
            class="w-full text-left px-4 py-2 hover:bg-crt-brown hover:text-crt-lightsep transition-colors duration-200 flex items-center"
          >
            <span class="mr-2">🚪</span> Logout
          </button>
        </div>
        
        <div class="mission-title text-xs md:text-sm">
          <span>Mission: {{ missionTitle }}</span>
        </div>
      </div>
      
      <div class="game-title text-center text-lg md:text-xl font-bold tracking-wider">
        SPRINT COMMANDER
      </div>
      
      <div class="stats flex items-center gap-4 text-xs md:text-sm">
        <div class="flex flex-col gap-1">
          <div class="score transition-colors duration-500">Score: {{ score }}</div>
          <div>Level: {{ level }}</div>
        </div>
        
        <div class="metrics flex flex-col gap-1">
          <div class="metric-bar">
            <div class="flex justify-between mb-1">
              <span>🎯 Outcome</span>
              <span>{{ scoreStore.getCurrentOutcome }}%</span>
            </div>
            <div class="w-32 h-2 bg-gray-200 rounded">
              <div 
                class="h-full rounded transition-all duration-300"
                :style="{ width: `${scoreStore.getCurrentOutcome}%` }"
                :class="{
                  'bg-green-600': scoreStore.getCurrentOutcome >= 75,
                  'bg-yellow-500': scoreStore.getCurrentOutcome >= 50 && scoreStore.getCurrentOutcome < 75,
                  'bg-red-600': scoreStore.getCurrentOutcome < 50
                }"
              ></div>
            </div>
          </div>
          
          <div class="metric-bar">
            <div class="flex justify-between mb-1">
              <span>⚡️ Burden</span>
              <span>{{ scoreStore.getCurrentBurden }}%</span>
            </div>
            <div class="w-32 h-2 bg-gray-200 rounded">
              <div 
                class="h-full rounded transition-all duration-300"
                :style="{ width: `${scoreStore.getCurrentBurden}%` }"
                :class="{
                  'bg-red-600': scoreStore.getCurrentBurden > 75,
                  'bg-yellow-500': scoreStore.getCurrentBurden > 50 && scoreStore.getCurrentBurden <= 75,
                  'bg-green-600': scoreStore.getCurrentBurden <= 50
                }"
              ></div>
            </div>
          </div>

          <div class="metric-bar">
            <div class="flex justify-between mb-1">
              <span>⏰ WMT</span>
              <span>{{ wmt }}%</span>
            </div>
            <div class="w-32 h-2 bg-gray-200 rounded">
              <div 
                class="h-full rounded transition-all duration-300"
                :style="{ width: `${wmt}%` }"
                :class="wmtClass"
              ></div>
            </div>
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
  position: relative;
  z-index: 50;
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

.stats {
  min-width: 160px;
}

.metric-bar {
  font-size: 0.6rem;
}
</style>