<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps<{
  member: {
    id: string;
    name: string;
    role: string;
    portrait: string;
    quote: string;
  }
}>();

const emit = defineEmits(['close']);

const message = ref('');
const chatHistory = ref([
  { role: 'assistant', content: props.member.quote }
]);
const isLoading = ref(false);
const error = ref('');

const sendMessage = async () => {
  if (!message.value.trim() || isLoading.value) return;

  const userMessage = message.value;
  message.value = '';
  isLoading.value = true;
  error.value = '';

  // Add user message to chat
  chatHistory.value.push({ role: 'user', content: userMessage });

  try {
    const serverUrl = import.meta.env.PROD 
      ? 'https://sprint-commander.netlify.app/api/chat'
      : 'http://localhost:3000/api/chat';
      
    const response = await axios.post(serverUrl, {
      roleId: props.member.id,
      history: chatHistory.value,
      message: userMessage
    });

    chatHistory.value.push({ role: 'assistant', content: response.data.reply });
  } catch (err) {
    error.value = 'Entschuldigung, ich konnte keine Antwort generieren.';
    console.error('Chat error:', err);
  } finally {
    isLoading.value = false;
  }
};

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div class="chat-view h-full flex flex-col">
    <div class="chat-header bg-crt-brown text-crt-glow p-3 flex items-center justify-between mb-4">
      <div class="member-name text-lg">{{ member.name }}</div>
      <button @click="handleClose" class="close-btn px-2">X</button>
    </div>
    
    <div class="chat-messages flex-grow bg-crt-lightsep p-4 mb-4 pixel-border overflow-y-auto">
      <div 
        v-for="(msg, index) in chatHistory" 
        :key="index" 
        :class="['chat-bubble mb-4 p-3 max-w-xs rounded-lg', 
                msg.role === 'user' ? 'ml-auto bg-crt-sepia' : 'bg-crt-brown text-crt-lightsep']"
      >
        {{ msg.content }}
      </div>
      
      <div v-if="isLoading" class="typing-indicator">
        <span>.</span><span>.</span><span>.</span>
      </div>
      
      <div v-if="error" class="error-message bg-red-500 text-white p-2 rounded mt-2">
        {{ error }}
      </div>
    </div>
    
    <div class="chat-input flex">
      <input 
        v-model="message" 
        type="text" 
        class="flex-grow p-3 bg-crt-lightsep border-2 border-crt-darkbrown"
        placeholder="Nachricht eingeben..."
        @keyup.enter="sendMessage"
        :disabled="isLoading"
      />
      <button 
        @click="sendMessage" 
        class="retro-button"
        :disabled="isLoading"
      >
        {{ isLoading ? '...' : 'Senden' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-header {
  border-radius: 4px;
}

.chat-bubble {
  position: relative;
  font-size: 0.9rem;
}

.chat-bubble::after {
  content: '';
  position: absolute;
  bottom: -10px;
  width: 0;
  height: 0;
  border: 10px solid transparent;
}

.chat-bubble:nth-child(odd)::after {
  left: 10px;
  border-top-color: theme('colors.crt.brown');
  border-bottom: 0;
}

.chat-bubble:nth-child(even)::after {
  right: 10px;
  border-top-color: theme('colors.crt.sepia');
  border-bottom: 0;
}

.chat-input input {
  font-family: 'Press Start 2P', monospace;
  font-size: 0.75rem;
  outline: none;
}

.typing-indicator {
  padding: 1rem;
  display: flex;
  justify-content: center;
}

.typing-indicator span {
  animation: typing 1s infinite;
  margin: 0 2px;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>