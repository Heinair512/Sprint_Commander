<script setup lang="ts">
defineProps<{
  message: string;
  tip: string;
}>();

const emit = defineEmits(['close']);
</script>

<template>
  <div class="action-feedback bg-crt-sepia p-4 rounded-lg shadow-lg max-w-2xl mx-auto">
    <div class="feedback-header bg-crt-brown text-crt-glow p-3 flex items-center justify-between mb-4 rounded">
      <div class="text-lg">Feedback</div>
      <button @click="$emit('close')" class="close-btn px-2">X</button>
    </div>
    
    <div class="feedback-content bg-crt-lightsep p-6 rounded mb-4">
      <p class="mb-6 leading-relaxed">{{ message }}</p>
      
      <div class="tip-section border-t-4 border-crt-brown pt-4 mt-6">
        <div class="tip-header text-crt-brown mb-2 font-bold">Tipp für die Zukunft:</div>
        <p class="text-sm italic">{{ tip }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.action-feedback {
  font-family: 'Press Start 2P', monospace;
  font-size: 0.8rem;
}

.tip-section {
  background-color: rgba(92, 67, 33, 0.1);
  padding: 1rem;
  border-radius: 4px;
}
</style>