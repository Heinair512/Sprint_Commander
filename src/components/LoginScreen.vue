<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

const emit = defineEmits(['login-success']);
const toast = useToast();

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref('');

// Simulated user database - in a real app, this would be in a secure backend
const defaultUser = {
  email: 'sprintcommander@tfn.io',
  // In a real app, this would be a hashed password
  password: 'SprintIT'
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

const handleLogin = async () => {
  error.value = '';
  
  // Validate email
  if (!validateEmail(email.value)) {
    error.value = '🚫 Diese E-Mail sieht aus wie ein Legacy-Code... Bitte korrigieren!';
    return;
  }
  
  // Validate password
  if (!validatePassword(password.value)) {
    error.value = '🔒 Passwort zu kurz! Mindestens 6 Zeichen für Production-Ready Security!';
    return;
  }
  
  isLoading.value = true;
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (email.value === defaultUser.email && password.value === defaultUser.password) {
      toast.success('🚀 Login erfolgreich! Sprint kann starten!', {
        timeout: 2000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
      });
      emit('login-success');
    } else {
      error.value = '⚠️ Authentication Failed: 404 - User not found in Production!';
      toast.error('💥 Login-Bug detected! Hotfix needed!', {
        timeout: 3000,
      });
    }
  } catch (err) {
    error.value = '🐛 Critical System Error: Timeout in Authentication Microservice!';
    console.error('Login error:', err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="login-screen min-h-screen bg-crt-bg flex items-center justify-center p-4">
    <div class="crt-frame bg-crt-sepia p-8 rounded-lg shadow-lg max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-2xl text-crt-darkbrown mb-2">SPRINT COMMANDER</h1>
        <p class="text-sm text-crt-brown">
          <img src="/assets/icons/lock.png" class="inline-block w-4 h-4 pixelated" alt="lock" />
          System Access Required
        </p>
        <p class="text-xs text-crt-brown mt-2">Initializing Authentication Protocol v2.0</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm text-crt-darkbrown mb-2">
            <img src="/assets/icons/mail.png" class="inline-block w-4 h-4 pixelated mr-2" alt="mail" />
            User Identity Token
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="w-full p-3 bg-crt-lightsep border-2 border-crt-darkbrown rounded focus:outline-none focus:border-crt-brown"
            :disabled="isLoading"
            placeholder="commander@sprint.ops"
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm text-crt-darkbrown mb-2">
            <img src="/assets/icons/key.png" class="inline-block w-4 h-4 pixelated mr-2" alt="key" />
            Access Code
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="w-full p-3 bg-crt-lightsep border-2 border-crt-darkbrown rounded focus:outline-none focus:border-crt-brown"
            :disabled="isLoading"
            placeholder="****************"
          />
        </div>
        
        <div v-if="error" class="text-red-600 text-sm text-center">
          <img src="/assets/icons/error.png" class="inline-block w-4 h-4 pixelated mr-2" alt="error" />
          {{ error }}
        </div>
        
        <button
          type="submit"
          class="retro-button w-full"
          :disabled="isLoading"
        >
          <template v-if="isLoading">
            <img src="/assets/icons/loading.png" class="inline-block w-4 h-4 pixelated animate-spin mr-2" alt="loading" />
            Compiling Access Tokens...
          </template>
          <template v-else>
            <img src="/assets/icons/play.png" class="inline-block w-4 h-4 pixelated mr-2" alt="play" />
            Commander Go
          </template>
        </button>
      </form>
      
      <p class="text-xs text-center mt-4 text-crt-brown">
        <img src="/assets/icons/shield.png" class="inline-block w-4 h-4 pixelated mr-1" alt="shield" />
        Secure Connection Established | v2.5.0-beta
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-screen {
  font-family: 'Press Start 2P', monospace;
}

input {
  font-family: 'Press Start 2P', monospace;
  font-size: 0.75rem;
}

input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.crt-frame {
  position: relative;
  overflow: hidden;
}

.crt-frame::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%,
    rgba(0, 0, 0, 0.1) 50%
  );
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 1;
}
</style>