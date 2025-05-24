<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
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
  { sender: 'member', text: 'Hallo! Wie kann ich helfen?' },
]);

const sendMessage = () => {
  if (message.value.trim()) {
    chatHistory.value.push({ sender: 'user', text: message.value });
    message.value = '';
    
    // Einfache "KI"-Antwort simulieren
    setTimeout(() => {
      chatHistory.value.push({ 
        sender: 'member', 
        text: 'Ich verstehe. Lass mich darüber nachdenken...' 
      });
    }, 1000);
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
                msg.sender === 'user' ? 'ml-auto bg-crt-sepia' : 'bg-crt-brown text-crt-lightsep']"
      >
        {{ msg.text }}
      </div>
    </div>
    
    <div class="chat-input flex">
      <input 
        v-model="message" 
        type="text" 
        class="flex-grow p-3 bg-crt-lightsep border-2 border-crt-darkbrown"
        placeholder="Nachricht eingeben..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage" class="retro-button">Senden</button>
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
</style>