<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
const chatHistory = ref([
  { role: 'assistant', content: props.member.quote }
]);
const isLoading = ref(false);
const error = ref('');

onMounted(() => {
  const initialText = {
    dev: `Lars Byte hier. Ich schaue mir gerade Event "${props.currentEvent.title}" an: ${props.currentEvent.description}`,
    ux: `Grace Grid hier. Schau dir das Event "${props.currentEvent.title}" an, ich denke über das UX-Design nach.`,
    coach: `Scrumlius meldet sich. Event "${props.currentEvent.title}" scheint komplex – lasst uns agil vorgehen.`,
    stake: `Maggie Money spricht. Wie schnell könnt ihr "${props.currentEvent.title}" umsetzen?`
  }[props.member.id] || "";

  if (initialText) {
    chatHistory.value.push({ role: 'assistant', content: initialText });
  }
});

const sendMessage = async () => {
  if (!message.value.trim() || isLoading.value) return;

  const userMessage = message.value;
  message.value = '';
  isLoading.value = true;
  error.value = '';

  chatHistory.value.push({ role: 'user', content: userMessage });

  try {
    const endpoint = import.meta.env.DEV
      ? 'http://localhost:8888/chat'
      : '/chat';

    const payload = {
      roleId: props.member.id,
      eventId: props.currentEvent.id,
      eventDescription: props.currentEvent.description,
      history: chatHistory.value.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      message: userMessage
    };

    const response = await axios.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    if (response.data && response.data.reply) {
      chatHistory.value.push({ role: 'assistant', content: response.data.reply });
    } else {
      throw new Error('Invalid response format from server');
    }
  } catch (err: any) {
    console.error('Chat error:', err);
    if (err.code === 'ECONNABORTED') {
      error.value = 'Die Verbindung zum Server hat zu lange gedauert. Bitte versuchen Sie es erneut.';
    } else if (err.response) {
      error.value = `Server-Fehler: ${err.response.status}. Bitte versuchen Sie es später erneut.`;
    } else if (err.request) {
      error.value = 'Keine Verbindung zum Server möglich. Bitte überprüfen Sie Ihre Internetverbindung.';
    } else {
      error.value = 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
    }
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
    <div class="chat-header bg-crt-brown text-crt-glow p-2 flex items-center justify-between mb-2">
      <div class="member-name text-sm">{{ member.name }}</div>
      <button @click="handleClose" class="close-btn px-2 text-sm">X</button>
    </div>
    
    <div class="chat-messages flex-grow bg-crt-lightsep p-2 mb-2 pixel-border overflow-y-auto">
      <div 
        v-for="(msg, index) in chatHistory" 
        :key="index" 
        :class="['chat-bubble mb-2 p-2 max-w-xs rounded-lg text-xs leading-relaxed', 
                msg.role === 'user' ? 'ml-auto bg-crt-sepia' : 'bg-crt-brown text-crt-lightsep']"
      >
        {{ msg.content }}
      </div>
      
      <div v-if="isLoading" class="typing-indicator text-xs">
        <span>.</span><span>.</span><span>.</span>
      </div>
      
      <div v-if="error" class="error-message bg-red-500 text-white p-2 rounded mt-2 text-xs">
        {{ error }}
      </div>
    </div>
    
    <div class="chat-input flex">
      <input 
        v-model="message" 
        type="text" 
        class="flex-grow p-2 bg-crt-lightsep border-2 border-crt-darkbrown text-xs"
        placeholder="Nachricht eingeben..."
        @keyup.enter="sendMessage"
        :disabled="isLoading"
      />
      <button 
        @click="sendMessage" 
        class="retro-button text-xs px-3"
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
  font-size: 0.7rem;
  line-height: 1.4;
}

.chat-bubble::after {
  content: '';
  position: absolute;
  bottom: -6px;
  width: 0;
  height: 0;
  border: 6px solid transparent;
}

.chat-bubble:nth-child(odd)::after {
  left: 6px;
  border-top-color: theme('colors.crt.brown');
  border-bottom: 0;
}

.chat-bubble:nth-child(even)::after {
  right: 6px;
  border-top-color: theme('colors.crt.sepia');
  border-bottom: 0;
}

.chat-input input {
  font-family: 'Press Start 2P', monospace;
  font-size: 0.65rem;
  outline: none;
}

.typing-indicator {
  padding: 0.5rem;
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