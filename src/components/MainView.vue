<script setup lang="ts">
import EventCard from './EventCard.vue';
import ChatView from './ChatView.vue';

defineProps<{
  currentEvent: {
    id: string;
    title: string;
    description: string;
    options: Array<{
      label: string;
      effect: number;
    }>
  };
  showChat: boolean;
  activeTeamMember: {
    id: string;
    name: string;
    role: string;
    portrait: string;
    quote: string;
  } | null;
}>();

const emit = defineEmits(['make-decision', 'close-chat', 'navigate']);

const handleDecision = (effect) => {
  emit('make-decision', effect);
};

const handleCloseChat = () => {
  emit('close-chat');
};

const handleNavigate = (direction) => {
  emit('navigate', direction);
};
</script>

<template>
  <div class="main-view h-full crt-frame p-4">
    <ChatView 
      v-if="showChat && activeTeamMember" 
      :member="activeTeamMember" 
      @close="handleCloseChat" 
    />
    <EventCard 
      v-else 
      :event="currentEvent" 
      @decision="handleDecision"
      @navigate="handleNavigate"
    />
  </div>
</template>

<style scoped>
.main-view {
  min-height: 400px;
  max-width: 600px;
  margin: 0 auto;
  image-rendering: pixelated;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}
</style>