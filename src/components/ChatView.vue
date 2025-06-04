<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useChatStore } from '../stores/chat';
import { useScoreStore } from '../stores/scoreStore';

const props = defineProps<{
  poId: string;
  memberId: string;
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
const isLoading = ref(false);
const error = ref('');
const chatStore = useChatStore();
const scoreStore = useScoreStore();

// Get event-specific history for AI context
const eventHistory = computed(() => 
  chatStore.getEventHistory(props.currentEvent.id)
);

// Get private chat history for display
const pairKey = computed(() => `${props.poId}-${props.memberId}`);
const privateHistory = computed(() => chatStore.messagesByPair[pairKey.value] || []);

// Get member name based on ID
const memberName = computed(() => {
  const nameMap: Record<string, string> = {
    dev: 'Lars Byte',
    ux: 'Grace Grid',
    coach: 'Scrumlius',
    stake: 'Maggie Money'
  };
  return nameMap[props.memberId] || props.memberId;
});

// Get current metrics for context
const metrics = computed(() => ({
  teamMorale: scoreStore.teamMorale,
  stakeholderSatisfaction: scoreStore.stakeholderSatisfaction,
  outcome: scoreStore.getCurrentOutcome,
  burden: scoreStore.getCurrentBurden
}));

function getSanitizedEventHistory() {
  return eventHistory.value.map(m => ({
    role: m.senderId === props.memberId ? 'assistant' : 'user',
    content: m.content
  }));
}

async function sendMessage() {
  const userText = message.value?.trim() ?? '';
  if (!userText || isLoading.value) return;

  isLoading.value = true;
  error.value = '';
  message.value = '';

  try {
    // Store PO's message
    chatStore.addPrivateMessage(
      props.poId,
      props.memberId,
      userText,
      props.currentEvent.id
    );

    // Prepare history for AI
    const historyForAI = getSanitizedEventHistory();

    // Build context message with metrics
    const contextMessage = `Current metrics - Team Morale: ${metrics.value.teamMorale}, Stakeholder Satisfaction: ${metrics.value.stakeholderSatisfaction}, Outcome: ${metrics.value.outcome}%, Burden: ${metrics.value.burden}%\n\nEvent context: ${props.currentEvent.description}\n\nUser message: ${userText}`;

    // Send to chat function
    const endpoint = import.meta.env.DEV ? '/api/chat' : '/chat';
    const payload = {
      roleId: props.memberId,
      eventId: props.currentEvent.id,
      eventDescription: props.currentEvent.description ?? '',
      history: historyForAI,
      message: contextMessage
    };

    const response = await axios.post(endpoint, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000
    });

    // Store AI's reply
    if (response.data?.reply) {
      chatStore.addPrivateReply(
        props.memberId,
        props.poId,
        response.data.reply,
        props.currentEvent.id
      );
    } else {
      throw new Error('Invalid response format');
    }
  } catch (err: any) {
    console.error('Chat error:', err);
    error.value = err.response?.data?.error || 'Ein Fehler ist aufgetreten';
    
    chatStore.addPrivateReply(
      props.memberId,
      props.poId,
      'Fehler beim Abrufen der Antwort.',
      props.currentEvent.id
    );
  } finally {
    isLoading.value = false;
  }
}

// Initial greeting when chat opens
onMounted(async () => {
  isLoading.value = true;
  try {
    const endpoint = import.meta.env.DEV ? '/api/chat' : '/chat';
    const initialContext = `Current metrics - Team Morale: ${metrics.value.teamMorale}, Stakeholder Satisfaction: ${metrics.value.stakeholderSatisfaction}, Outcome: ${metrics.value.outcome}%, Burden: ${metrics.value.burden}%\n\nEvent context: ${props.currentEvent.description}`;
    
    const response = await axios.post(endpoint, {
      roleId: props.memberId,
      eventId: props.currentEvent.id,
      eventDescription: props.currentEvent.description,
      history: [],
      message: `${initialContext}\n\nGreet the Product Owner professionally and briefly comment on the current situation.`
    });

    if (response.data?.reply) {
      chatStore.addPrivateReply(
        props.memberId,
        props.poId,
        response.data.reply,
        props.currentEvent.id
      );
    }
  } catch (err) {
    console.error('Initial greeting error:', err);
  } finally {
    isLoading.value = false;
  }
});

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div class="chat-view h-full flex flex-col">
    <div class="chat-header bg-crt-brown text-crt-glow p-3 flex items-center justify-between mb-4">
      <div class="member-name text-lg">Chat mit {{ memberName }}</div>
      <button @click="handleClose" class="close-btn px-2">X</button>
    </div>
    
    <div class="chat-messages flex-grow bg-crt-lightsep p-4 mb-4 pixel-border overflow-y-auto">
      <div 
        v-for="msg in privateHistory" 
        :key="msg.timestamp"
        :class="[
          'chat-bubble mb-4 p-3 max-w-xs rounded-lg',
          msg.senderId === props.poId ? 'ml-auto bg-crt-sepia' : msg.senderId
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
        :placeholder="`Nachricht an ${memberName}...`"
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

.chat-messages {
  max-height: 960px;
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
</style>