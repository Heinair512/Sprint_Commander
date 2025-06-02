<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

const props = defineProps<{
  member: {
    id: string;
    name: string;
    role: string;
    portrait: string;
    quote: string;
  };
  currentEvent: {
    id: string;
    title: string;
    description: string;
    options: Array<{
      label: string;
      effect: number;
    }>;
  };
}>();

const emit = defineEmits(['close']);

const message = ref('');
const chatHistory = ref<Array<{ role: string; content: string }>>([]);
const isLoading = ref(false);
const error = ref('');

const generateInitialMessage = () => {
  const initialText = {
    dev: `Entwickler Lars Byte hier. Ich analysiere gerade Event "${props.currentEvent?.title || ''}" technisch: ${props.currentEvent?.description || ''}`,
    ux: `UX-Designerin Grace Grid hier. Lass uns über die User Experience bei "${props.currentEvent?.title || ''}" sprechen.`,
    coach: `Agile Coach Scrumlius meldet sich. Event "${props.currentEvent?.title || ''}" braucht einen klaren agilen Ansatz.`,
    stake: `Stakeholder Maggie Money hier. "${props.currentEvent?.title || ''}" muss schnell ROI generieren.`
  }[props.member.id] || '';

  if (initialText) {
    chatHistory.value = [{ role: 'assistant', content: initialText }];
  }
};

// Watch for changes in member ID to reset chat
watch(() => props.member.id, () => {
  generateInitialMessage();
}, { immediate: true });

const sendMessage = async () => {
  if (!message.value.trim() || isLoading.value) return;

  const userMessage = message.value;
  message.value = '';
  isLoading.value = true;
  error.value = '';

  const sanitizedHistory = chatHistory.value.map(msg => ({
    role: msg.role || 'user',
    content: msg.content || ''
  }));

  chatHistory.value.push({ role: 'user', content: userMessage });

  try {
    const payload = {
      roleId: props.member.id || '',
      eventId: props.currentEvent?.id || '',
      eventDescription: props.currentEvent?.description || '',
      history: sanitizedHistory,
      message: userMessage || ''
    };

    const response = await axios.post('/chat', payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    if (response.data?.reply) {
      chatHistory.value.push({ role: 'assistant', content: response.data.reply });
    } else {
      throw new Error('Invalid response format from server');
    }
  } catch (err: any) {
    console.error('Chat error:', err);
    error.value = err.response?.data?.error || 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.';
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
        :class="[
          'chat-bubble mb-4 p-4 max-w-md rounded-lg',
          msg.role === 'user' ? 'ml-auto bg-crt-sepia' : member.id
        ]"
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
  font-size: 0.85rem;
  line-height: 1.6;
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

.chat-messages {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.crt.darkbrown') theme('colors.crt.lightsep');
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: theme('colors.crt.lightsep');
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: theme('colors.crt.darkbrown');
  border-radius: 3px;
}
</style>