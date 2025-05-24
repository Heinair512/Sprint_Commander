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
  <div class="pixel-portrait" :style="{ backgroundImage: `url(${member.portrait})` }"></div>
</template>

<style scoped>
.pixel-portrait {
  width: 64px;
  height: 64px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
</style>