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
  const score = memberScore.value;
  return props.member.role === 'Stakeholder' 
    ? score.teamMorale + score.stakeholderSatisfaction 
    : score.teamMorale + score.stakeholderSatisfaction;
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
      class="speech-bubble absolute -top-12 left-1/2 transform -translate-x-1/2"
    >
      {{ speechBubbleText }}
    </div>
    
    <div 
      class="pixel-portrait cursor-pointer transition-transform hover:scale-105" 
      :style="{ backgroundImage: `url(${member.portrait})` }"
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
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 256px;
}

.pixel-portrait {
  width: 256px;
  height: 256px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  transition: transform 0.2s ease;
}

.portrait-info {
  width: 100%;
  text-align: center;
}

.mood-label {
  display: inline-block;
  font-family: 'Press Start 2P', monospace;
  transition: background-color 0.3s ease;
}

.speech-bubble {
  background: theme('colors.crt.lightsep');
  border: 2px solid theme('colors.crt.darkbrown');
  padding: 0.5rem;
  border-radius: 1rem;
  font-size: 1.5rem;
  z-index: 10;
  animation: pop-in 0.3s ease-out;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
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
</style>