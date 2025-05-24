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
  <div class="team-portrait pixel-border bg-crt-lightsep mb-4 cursor-pointer transition-all hover:bg-crt-sepia">
    <div class="portrait p-2">
      <div class="w-full aspect-square bg-crt-sepia rounded-sm flex items-center justify-center overflow-hidden">
        <div class="pixel-portrait" :style="{ backgroundImage: `url(${member.portrait})` }"></div>
      </div>
    </div>
    <div class="member-info bg-crt-sepia p-2 text-xs">
      <div class="member-role uppercase font-bold">{{ member.role }}</div>
      <div class="member-name text-xs">{{ member.name }}</div>
    </div>
  </div>
</template>

<style scoped>
.team-portrait {
  width: 100%;
  max-width: 150px;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.team-portrait:hover {
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(252, 239, 180, 0.3);
}

.portrait {
  image-rendering: pixelated;
}

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