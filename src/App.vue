<script setup lang="ts">
import { ref } from 'vue';
import GameView from './views/GameView.vue';
import LoginScreen from './components/LoginScreen.vue';
import WelcomeScreen from './components/WelcomeScreen.vue';

const isAuthenticated = ref(false);
const showWelcome = ref(false);

const handleLoginSuccess = () => {
  isAuthenticated.value = true;
  showWelcome.value = true;
};

const handleWelcomeClose = () => {
  showWelcome.value = false;
};

const handleLogout = () => {
  isAuthenticated.value = false;
  showWelcome.value = false;
};
</script>

<template>
  <LoginScreen v-if="!isAuthenticated" @login-success="handleLoginSuccess" />
  <div v-else class="crt-screen">
    <div class="crt-overlay"></div>
    <WelcomeScreen v-if="showWelcome" @close="handleWelcomeClose" />
    <GameView v-else @logout="handleLogout" />
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