<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import axios from 'axios';

interface Message {
  id: number;
  sender: string;
  senderLabel: string;
  text: string;
}

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
const chatHistory = ref<Message[]>([]);
const isLoading = ref(false);
const chatContainer = ref<HTMLElement | null>(null);

function pickTwoRoles(): [string, string] {
  const allRoles = ['dev', 'ux', 'coach', 'stake'];
  const copy = [...allRoles];
  const first = copy.splice(Math.floor(Math.random() * copy.length), 1)[0];
  const second = copy[Math.floor(Math.random() * copy.length)];
  return [first, second];
}

const nameMap: Record<string, string> = {
  dev: 'Lars Byte',
  ux: 'Grace Grid',
  coach: 'Scrumlius',
  stake: 'Maggie Money'
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const sendMessage = async () => {
  if (!message.value.trim() || isLoading.value) return;

  const userMessage = message.value;
  message.value = '';
  isLoading.value = true;

  // Add user message to chat
  chatHistory.value.push({
    id: Date.now(),
    sender: 'user',
    senderLabel: 'Du',
    text: userMessage
  });

  await scrollToBottom();

  // Get two random roles to respond
  const [roleA, roleB] = pickTwoRoles();

  try {
    // Send requests for both roles
    for (const roleId of [roleA, roleB]) {
      const endpoint = import.meta.env.DEV ? '/api/chat' : '/chat';
      
      const response = await axios.post(endpoint, {
        roleId,
        eventId: props.event.id,
        eventDescription: props.event.description,
        history: chatHistory.value.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        message: userMessage
      });

      if (response.data && response.data.reply) {
        chatHistory.value.push({
          id: Date.now() + Math.random(),
          sender: roleId,
          senderLabel: nameMap[roleId],
          text: response.data.reply
        });
        await scrollToBottom();
      }
    }
  } catch (err) {
    console.error('Team chat error:', err);
    chatHistory.value.push({
      id: Date.now(),
      sender: 'system',
      senderLabel: 'System',
      text: 'Fehler bei der Kommunikation mit dem Team. Bitte versuche es später erneut.'
    });
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
};

const handleClose = () => {
  emit('close');
};

// Initialize with system message
chatHistory.value.push({
  id: Date.now(),
  sender: 'system',
  senderLabel: 'System',
  text: `🚨 ALARM: ${props.event.title}! 🚨`
});

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
        v-for="msg in chatHistory" 
        :key="msg.id"
        :class="[
          'chat-message mb-4 p-3 rounded-lg max-w-xs',
          msg.sender === 'user' ? 'ml-auto bg-crt-sepia' : 
          msg.sender === 'system' ? 'mx-auto bg-red-600 text-white' :
          `chat-bubble ${msg.sender}`
        ]"
      >
        <div 
          v-if="msg.sender !== 'user' && msg.sender !== 'system'"
          class="text-xs mb-1 font-bold"
        >
          {{ msg.senderLabel }}
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
        :disabled="isLoading"
      />
      <button 
        @click="sendMessage" 
        class="retro-button ml-2"
        :disabled="isLoading"
      >
        {{ isLoading ? '...' : 'Senden' }}
      </button>
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

.chat-input input:disabled,
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.chat-bubble {
  @apply bg-crt-brown text-crt-lightsep;
}

.chat-bubble.dev {
  border-left: 4px solid #4CAF50;
}

.chat-bubble.ux {
  border-left: 4px solid #2196F3;
}

.chat-bubble.coach {
  border-left: 4px solid #FFC107;
}

.chat-bubble.stake {
  border-left: 4px solid #F44336;
}
</style>