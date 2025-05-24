<script setup lang="ts">
defineProps<{
  missionTitle: string;
  score: number;
  level: string;
}>();
</script>

<template>
  <header class="header-bar p-2 bg-crt-sepia text-crt-darkbrown border-b-4 border-crt-darkbrown flex items-center justify-between">
    <div class="flex items-center space-x-4">
      <button class="burger-menu p-1">
        <div class="w-6 h-0.5 bg-crt-darkbrown mb-1"></div>
        <div class="w-6 h-0.5 bg-crt-darkbrown mb-1"></div>
        <div class="w-6 h-0.5 bg-crt-darkbrown"></div>
      </button>
      <div class="mission-title text-xs md:text-sm">Mission: {{ missionTitle }}</div>
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

.score {
  position: relative;
}

.score.success {
  color: #90EE90;
}

.score.error {
  color: #8B0000;
}
</style>