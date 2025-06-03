<script setup lang="ts">
import { computed } from 'vue';
import { useScoreStore } from '../stores/scoreStore';

const props = defineProps<{
  member: {
    id: string;
    name: string;
    role: string;
    portrait: string;
  }
}>();

const scoreStore = useScoreStore();

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
</script>

<template>
  <div class="team-portrait-container">
    <div class="pixel-portrait">
      <img 
        :src="member.portrait"
        :alt="member.name"
        class="w-full h-full object-contain pixelated"
        loading="lazy"
      />
    </div>
    
    <div class="portrait-info">
      <div class="member-name text-xs text-crt-darkbrown">{{ member.name }}</div>
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
  @apply flex flex-col items-center w-full max-w-[200px] mx-auto;
}

.pixel-portrait {
  @apply w-full aspect-square bg-crt-sepia/20 rounded overflow-hidden flex items-center justify-center;
  border: 2px solid theme('colors.crt.sepia');
}

.pixelated {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.portrait-info {
  @apply w-full text-center mt-1;
}

.member-name {
  @apply font-mono truncate mb-1;
}

.mood-label {
  @apply inline-block font-mono text-[10px] sm:text-xs;
  transition: background-color 0.3s ease;
}

@media (max-width: 1024px) {
  .team-portrait-container {
    max-width: 160px;
  }
}

@media (max-width: 640px) {
  .team-portrait-container {
    max-width: 120px;
  }
  
  .mood-label {
    font-size: 8px;
    padding: 4px 8px;
  }
  
  .member-name {
    font-size: 8px;
  }
}
</style>