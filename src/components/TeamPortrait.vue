<script setup lang="ts">
import { computed } from 'vue';
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

const moodValue = computed(() => {
  return props.member.role === 'Stakeholder' 
    ? scoreStore.stakeholderSatisfaction 
    : scoreStore.teamMorale;
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
    <div 
      class="pixel-portrait cursor-pointer transition-transform hover:scale-105" 
      :style="{ backgroundImage: `url(${member.portrait})` }"
    ></div>
    <div class="portrait-info mt-2">
      <div class="name text-sm text-crt-darkbrown">{{ member.name }}</div>
      <div class="role text-xs text-crt-brown">{{ member.role }}</div>
      <div 
        class="mood-label text-xs text-crt-lightsep px-2 py-1 rounded mt-1"
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
</style>