<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue';
import axios from 'axios';
import { useScoreStore } from '../stores/scoreStore';
import { useChatStore } from '../stores/chat';

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
const initialResponsesLoaded = ref(false);
const scoreStore = useScoreStore();
const chatStore = useChatStore();
const selectedPersona = ref<"dev"|"ux"|"coach"|"stake"|"">("");

const nameMap: Record<string, string> = {
  dev: 'Lars Byte',
  ux: 'Grace Grid',
  coach: 'Scrumlius',
  stake: 'Maggie Money'
};

// Get full event history for context
const fullHistory = computed(() => 
  chatStore.sharedHistory.filter(m => m.eventId === props.event.id)
);

const getGameContext = () => {
  const metrics = {
    teamMorale: scoreStore.teamMorale,
    stakeholderSatisfaction: scoreStore.stakeholderSatisfaction,
    outcome: scoreStore.getCurrentOutcome,
    burden: scoreStore.getCurrentBurden
  };

  return `Current Game State:
- Team Morale: ${metrics.teamMorale}%
- Stakeholder Satisfaction: ${metrics.stakeholderSatisfaction}%
- Project Outcome: ${metrics.outcome}%
- Team Burden: ${metrics.burden}%

Current Event: ${props.event.description}`;
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const triggerInitialTeamResponses = async () => {
  if (initialResponsesLoaded.value) return;
  
  isLoading.value = true;
  
  try {
    chatHistory.value = [{
      id: Date.now(),
      sender: 'system',
      senderLabel: 'System',
      text: `🚨 ALARM: ${props.event.title}! 🚨`
    }];

    // Choose one random team member for initial response
    const randomMember = props.team[Math.floor(Math.random() * props.team.length)];
    
    const endpoint = import.meta.env.DEV ? '/api/chat' : '/chat';
    const response = await axios.post(endpoint, {
      roleId: randomMember.id,
      eventId: props.event.id,
      eventDescription: props.event.description,
      history: [],
      message: `${getGameContext()}\n\nGive a brief, role-specific initial assessment of this situation (max 2 sentences).`
    });

    if (response.data && response.data.reply) {
      chatHistory.value.push({
        id: Date.now() + Math.random(),
        sender: randomMember.id,
        senderLabel: nameMap[randomMember.id],
        text: response.data.reply
      });
      await scrollToBottom();
    }
    
    initialResponsesLoaded.value = true;
  } catch (err) {
    console.error('Initial team responses error:', err);
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

const sendMessage = async () => {
  if (!message.value.trim() || isLoading.value) return;

  const userMessage = message.value;
  message.value = '';
  isLoading.value = true;

  // Add user message to chat history
  chatHistory.value.push({
    id: Date.now(),
    sender: 'user',
    senderLabel: 'Du',
    text: userMessage
  });

  await scrollToBottom();

  try {
    // Determine who should respond
    const respondingMember = selectedPersona.value || props.team[Math.floor(Math.random() * props.team.length)].id;
    
    // Store message in shared history if using @mention
    if (selectedPersona.value) {
      chatStore.addPrivateMessage('po', respondingMember, userMessage, props.event.id);
    }

    // Prepare history for AI
    const historyForAI = selectedPersona.value 
      ? fullHistory.value.map(m => ({
          role: m.senderId === respondingMember ? 'assistant' : 'user',
          content: m.content
        }))
      : chatHistory.value.map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }));

    const endpoint = import.meta.env.DEV ? '/api/chat' : '/chat';
    const contextMessage = `${getGameContext()}\n\n${userMessage}`;
    
    const response = await axios.post(endpoint, {
      roleId: respondingMember,
      eventId: props.event.id,
      eventDescription: props.event.description,
      history: historyForAI,
      message: contextMessage
    });

    if (response.data && response.data.reply) {
      // Store response in both chat history and shared history if using @mention
      if (selectedPersona.value) {
        chatStore.addPrivateReply(
          respondingMember,
          'po',
          response.data.reply,
          props.event.id
        );
      }
      
      chatHistory.value.push({
        id: Date.now() + Math.random(),
        sender: respondingMember,
        senderLabel: nameMap[respondingMember],
        text: response.data.reply
      });
      
      await scrollToBottom();
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
    selectedPersona.value = ""; // Reset selected persona
    await scrollToBottom();
  }
};

const handleClose = () => {
  emit('close');
};

watch(() => props.event.id, () => {
  chatHistory.value = [];
  initialResponsesLoaded.value = false;
  triggerInitialTeamResponses();
});

// Trigger initial responses when component mounts
triggerInitialTeamResponses();
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
          'chat-message mb-4 p-4 rounded-lg max-w-md',
          {
            'ml-auto bg-crt-sepia': msg.sender === 'user',
            'mx-auto bg-red-600 text-white': msg.sender === 'system',
            [`chat-bubble ${msg.sender}`]: !['user', 'system'].includes(msg.sender)
          }
        ]"
      >
        <div 
          v-if="msg.sender !== 'user' && msg.sender !== 'system'"
          class="text-sm mb-2 font-bold"
        >
          {{ msg.senderLabel }}
        </div>
        {{ msg.text }}
      </div>
      
      <div v-if="isLoading" class="typing-indicator">
        <span>.</span><span>.</span><span>.</span>
      </div>
    </div>
    
    <div class="chat-input flex flex-col p-4 bg-crt-sepia border-t-2 border-crt-darkbrown">
      <div class="flex items-center gap-2 mb-2">
        <select 
          v-model="selectedPersona" 
          class="p-2 bg-crt-lightsep border-2 border-crt-darkbrown rounded text-sm"
        >
          <option value="">Team ansprechen</option>
          <option value="dev">@Lars Byte</option>
          <option value="ux">@Grace Grid</option>
          <option value="coach">@Scrumlius</option>
          <option value="stake">@Maggie Money</option>
        </select>
      </div>
      
      <div class="flex">
        <input 
          v-model="message" 
          type="text" 
          class="flex-grow p-3 bg-crt-lightsep border-2 border-crt-darkbrown rounded"
          :placeholder="selectedPersona ? `@${nameMap[selectedPersona]} ansprechen...` : 'Nachricht ans Team...'"
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
  </div>
</template>

<style scoped>
.chat-message {
  word-break: break-word;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  line-height: 1.6;
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
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: theme('colors.crt.lightsep');
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: theme('colors.crt.darkbrown');
  border-radius: 3px;
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

select {
  font-family: 'Press Start 2P', monospace;
  font-size: 0.75rem;
  outline: none;
}
</style>