<script setup lang="ts">
import GameView from './views/GameView.vue'
</script>

<template>
  <div class="crt-screen">
    <div class="crt-overlay"></div>
    <GameView />
  </div>
</template>

<style>
.crt-screen {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: theme('colors.crt.bg');
  overflow: hidden;
}
</style>