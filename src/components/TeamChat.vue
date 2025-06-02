<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';

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

const chatContainer = ref<HTMLElement | null>(null);

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const sendMessage = () => {
  if (message.value.trim()) {
    chatHistory.value.push({ sender: 'user', text: message.value });
    message.value = '';
    scrollToBottom();
    
    // Simulate team response after a short delay
    setTimeout(() => {
      const responses = [
        { sender: 'dev', text: 'Ich sehe erhöhte Error-Raten in den Logs!' },
        { sender: 'coach', text: 'Lasst uns einen War Room aufsetzen!' },
        { sender: 'ux', text: 'Support-Tickets steigen exponentiell!' },
        { sender: 'stake', text: 'Brauchen wir einen Rollback?' }
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      chatHistory.value.push(randomResponse);
      scrollToBottom();
    }, 1000);
  }
};

const handleClose = () => {
  emit('close');
};

// Watch for new messages and scroll to bottom
watch(() => chatHistory.value.length, () => {
  scrollToBottom();
});
</script>

<template>
  <div class="team-chat h-full flex flex-col bg-crt-sepia rounded-lg shadow-lg">
    <div class="chat-header bg-crt-brown text-crt-glow p-3 flex items-center justify-between rounded-t-lg">
      <div class="text-lg">🚨 Team Chat: {{ event.title }}</div>
      <button @click="handleClose" class="close-btn px-2">X</button>
    </div>
    
    <div 
      ref="chatContainer"
      class="chat-messages flex-grow bg-crt-lightsep p-4 overflow-y-auto"
    >
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
    
    <div class="chat-input flex p-4 bg-crt-sepia border-t-2 border-crt-darkbrown">
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
  transition: all 0.3s ease;
}

.chat-message:hover {
  transform: scale(1.02);
}

.chat-input input {
  font-family: 'Press Start 2P', monospace;
  font-size: 0.75rem;
  outline: none;
}

.chat-messages {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.crt.darkbrown') theme('colors.crt.lightsep');
}

.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: theme('colors.crt.lightsep');
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: theme('colors.crt.darkbrown');
  border-radius: 4px;
}
</style>