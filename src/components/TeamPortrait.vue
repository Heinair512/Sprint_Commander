<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useScoreStore } from '../stores/scoreStore';

const props = defineProps<{
  member: {
    id: string;
    name: string;
    role: string;
    portrait: string;
    quote: string;
  }
}>();

const scoreStore = useScoreStore();
const showSpeechBubble = ref(false);
const speechBubbleText = ref('');

const memberScore = computed(() => scoreStore.getMemberScore(props.member.id));

const moodValue = computed(() => {
  return props.member.role === 'Stakeholder' 
    ? memberScore.value.stakeholderSatisfaction 
    : memberScore.value.teamMorale;
});

const moodDisplay = computed(() => {
  const value = moodValue.value;
  return value > 0 ? `+${value}` : value.toString();
});

const moodClass = computed(() => {
  const value = moodValue.value;
  if (value > 0) return 'bg-green-800';
  if (value < 0) return 'bg-red-800';
  return 'bg-gray-800';
});

watch(moodValue, (newValue, oldValue) => {
  if (oldValue !== undefined && newValue !== oldValue) {
    const change = newValue - oldValue;
    speechBubbleText.value = change > 0 ? '😊' : '😠';
    showSpeechBubble.value = true;
    
    setTimeout(() => {
      showSpeechBubble.value = false;
    }, 2000);
  }
});
</script>

<template>
  <div class="team-portrait-container relative">
    <div 
      v-if="showSpeechBubble" 
      class="speech-bubble absolute -top-8 lg:-top-12 left-1/2 transform -translate-x-1/2"
    >
      {{ speechBubbleText }}
    </div>
    
    <div 
      class="pixel-portrait cursor-pointer transition-transform hover:scale-105" 
      :style="{
        backgroundImage: `url(${member.portrait.startsWith('/') ? member.portrait : '/' + member.portrait})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }"
    ></div>
    <div class="portrait-info mt-2">
      <div 
        class="mood-label text-xs text-crt-lightsep px-2 py-1 rounded"
        :class="moodClass"
      >
        Stimmung: {{ moodDisplay }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.team-portrait-container {
  @apply flex flex-col items-center w-full max-w-[256px] mx-auto;
}

.pixel-portrait {
  @apply w-full aspect-square;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  transition: transform 0.2s ease;
}

.portrait-info {
  @apply w-full text-center;
}

.mood-label {
  @apply inline-block font-mono text-[10px] sm:text-xs;
  transition: background-color 0.3s ease;
}

.speech-bubble {
  @apply bg-crt-lightsep border-2 border-crt-darkbrown p-2 rounded-full text-xl z-10;
  animation: pop-in 0.3s ease-out;
}

.speech-bubble::after {
  content: '';
  @apply absolute -bottom-2 left-1/2 transform -translate-x-1/2;
  border-width: 10px 10px 0;
  border-style: solid;
  border-color: theme('colors.crt.darkbrown') transparent transparent;
}

@keyframes pop-in {
  0% {
    transform: translate(-50%, 20px) scale(0);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, 0) scale(1);
    opacity: 1;
  }
}

@media (max-width: 1024px) {
  .team-portrait-container {
    max-width: 180px;
  }
}

@media (max-width: 640px) {
  .team-portrait-container {
    max-width: 140px;
  }
  
  .mood-label {
    font-size: 8px;
    padding: 4px 8px;
  }
}
</style>