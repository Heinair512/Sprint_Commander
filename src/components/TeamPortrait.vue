<script setup lang="ts">
defineProps<{
  member: {
    id: string;
    name: string;
    role: string;
    portrait: string;
    quote: string;
  }
}>();
</script>

<template>
  <div 
    class="pixel-portrait cursor-pointer transition-transform hover:scale-105" 
    :style="{ backgroundImage: `url(${member.portrait})` }"
  ></div>
</template>

<style scoped>
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
</style>