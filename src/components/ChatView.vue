import { ref, onMounted } from 'vue';
import axios from 'axios';

interface Message {
  id: number;
  role: 'user' | 'assistant' | 'system';
  sender?: string;
  content: string;
}

const props = defineProps<{
  member: {
    id: string;
    name: string;
    role: string;
    portrait: string;
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
const chatHistory = ref<Message[]>([]);
const isLoading = ref(false);
const error = ref('');

function pickTwoRoles(): [string, string] {
  const allRoles = ['dev', 'ux', 'coach', 'stake'].filter(id => id !== props.member.id);
  const copy = [...allRoles];
  const first = copy.splice(Math.floor(Math.random() * copy.length), 1)[0];
  const second = copy[Math.floor(Math.random() * copy.length)];
  return [first, second];
}

const nameMap = {
  dev: 'Lars Byte',
  ux: 'Grace Grid',
  coach: 'Scrumlius',
  stake: 'Maggie Money'
};

onMounted(() => {
  const initialText = {
    dev: `Lars Byte hier. Ich schaue mir gerade Event "${props.currentEvent.title}" an: ${props.currentEvent.description}`,
    ux: `Grace Grid hier. Schau dir das Event "${props.currentEvent.title}" an, ich denke über das UX-Design nach.`,
    coach: `Scrumlius meldet sich. Event "${props.currentEvent.title}" scheint komplex – lasst uns agil vorgehen.`,
    stake: `Maggie Money spricht. Wie schnell könnt ihr "${props.currentEvent.title}" umsetzen?`
  }[props.member.id];

  if (initialText) {
    chatHistory.value.push({
      id: Date.now(),
      role: 'assistant',
      sender: props.member.id,
      content: initialText
    });
  }
});

const sendMessage = async () => {
  if (!message.value.trim() || isLoading.value) return;

  const userMessage = message.value;
  message.value = '';
  isLoading.value = true;
  error.value = '';

  // Add user message to chat
  chatHistory.value.push({
    id: Date.now(),
    role: 'user',
    content: userMessage
  });

  try {
    // Get two random roles to respond
    const [roleA, roleB] = pickTwoRoles();

    // Send requests for both roles
    for (const roleId of [roleA, roleB]) {
      try {
        const response = await axios.post('/chat', {
          roleId,
          eventId: props.currentEvent.id,
          eventDescription: props.currentEvent.description,
          history: chatHistory.value.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          message: userMessage
        });

        if (response.data && response.data.reply) {
          chatHistory.value.push({
            id: Date.now() + Math.random(),
            role: 'assistant',
            sender: roleId,
            content: response.data.reply
          });
        }
      } catch (err) {
        console.error('Chat error for role', roleId, err);
        error.value = `Fehler beim Abrufen der Antwort von ${nameMap[roleId]}`;
      }
    }
  } catch (err) {
    console.error('Chat error:', err);
    error.value = 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
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
        v-for="msg in chatHistory" 
        :key="msg.id" 
        :class="[
          'chat-bubble mb-4 p-3 max-w-xs rounded-lg',
          msg.role === 'user' ? 'ml-auto bg-crt-sepia' : 'bg-crt-brown text-crt-lightsep'
        ]"
      >
        <div v-if="msg.sender" class="text-xs mb-1 opacity-80">
          {{ nameMap[msg.sender] }}
        </div>
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