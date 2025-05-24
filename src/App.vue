<script setup lang="ts">
import { ref } from 'vue';
import GameView from './views/GameView.vue';
import LoginScreen from './components/LoginScreen.vue';

const isAuthenticated = ref(false);

const handleLoginSuccess = () => {
  isAuthenticated.value = true;
};
</script>

<template>
  <LoginScreen v-if="!isAuthenticated" @login-success="handleLoginSuccess" />
  <div v-else class="crt-screen">
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