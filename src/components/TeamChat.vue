<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  event: {
    id: string;
    title: string;
    description: string;
  },
  team: Array<{
    id: string;
    name: string;
    role: string;
    quote: string;
  }>
}>();

const emit = defineEmits(['close']);

const message = ref('');
const chatHistory = ref([
  { sender: 'system', text: '🚨 ALARM: Production Outage detected! 🚨' },
  { sender: 'dev', text: 'OMG! Ich schaue sofort in die Logs!' },
  { sender: 'ux', text: 'Die User melden schon Probleme im Support-Chat!' },
  { sender: 'coach', text: 'Bleibt ruhig! Was sagen die Metriken?' },
  { sender: 'stake', text: 'Wir verlieren GELD! Jede Minute!' }
]);

const sendMessage = () => {
  if (message.value.trim()) {
    chatHistory.value.push({ sender: 'user', text: message.value });
    message.value = '';
  }
};

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div class="team-chat bg-crt-sepia p-4 rounded-lg shadow-lg max-w-2xl mx-auto">
    <div class="chat-header bg-crt-brown text-crt-glow p-3 flex items-center justify-between mb-4 rounded">
      <div class="text-lg">🚨 Team Chat: {{ event.title }}</div>
      <button @click="handleClose" class="close-btn px-2">X</button>
    </div>
    
    <div class="chat-messages bg-crt-lightsep p-4 rounded mb-4 h-96 overflow-y-auto">
      <div 
        v-for="(msg, index) in chatHistory" 
        :key="index"
        :class="[
          'chat-message mb-4 p-3 rounded-lg max-w-xs',
          msg.sender === 'user' ? 'ml-auto bg-crt-sepia' : 'bg-crt-brown text-crt-lightsep',
          msg.sender === 'system' ? 'mx-auto bg-red-600 text-white' : ''
        ]"
      >
        <div class="text-xs mb-1" v-if="msg.sender !== 'user' && msg.sender !== 'system'">
          {{ team.find(t => t.id === msg.sender)?.name }}
        </div>
        {{ msg.text }}
      </div>
    </div>
    
    <div class="chat-input flex">
      <input 
        v-model="message" 
        type="text" 
        class="flex-grow p-3 bg-crt-lightsep border-2 border-crt-darkbrown rounded"
        placeholder="Deine Nachricht..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage" class="retro-button ml-2">Senden</button>
    </div>
  </div>
</template>

<style scoped>
.chat-message {
  word-break: break-word;
}

.chat-input input {
  font-family: 'Press Start 2P', monospace;
  font-size: 0.75rem;
  outline: none;
}
</style>