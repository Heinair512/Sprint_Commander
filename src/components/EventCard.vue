<script setup lang="ts">
defineProps<{
  event: {
    id: string;
    title: string;
    description: string;
    options: Array<{
      label: string;
      effect: number;
    }>
  }
}>();

const emit = defineEmits(['decision', 'navigate']);

const makeDecision = (effect: number) => {
  emit('decision', effect);
};

const navigate = (direction: 'prev' | 'next') => {
  emit('navigate', direction);
};
</script>

<template>
  <div class="event-card h-full flex flex-col">
    <div class="event-title-container bg-crt-brown text-crt-glow p-3 mb-4 flex items-center justify-between">
      <button 
        @click="navigate('prev')"
        class="nav-arrow px-2 hover:text-crt-sepia transition-colors"
      >←</button>
      
      <div class="event-title uppercase text-center flex-grow">
        {{ event.title }}
      </div>
      
      <button 
        @click="navigate('next')"
        class="nav-arrow px-2 hover:text-crt-sepia transition-colors"
      >→</button>
    </div>
    
    <div class="event-content flex-grow bg-crt-lightsep p-4 mb-2 pixel-border">
      <div class="flex gap-4">
        <div class="event-illustration flex-shrink-0">
          <div class="w-32 h-32 bg-crt-sepia flex items-center justify-center pixelated overflow-hidden">
            <div 
              class="pixel-event-image"
              :style="{
                backgroundImage: `url(/assets/events/${event.id}.png)`,
                width: '100%',
                height: '100%',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                imageRendering: 'pixelated'
              }"
            ></div>
          </div>
        </div>
        
        <div class="event-description flex-grow text-left">
          {{ event.description }}
        </div>
      </div>
    </div>
    
    <div class="event-options flex flex-col gap-2">
      <button 
        v-for="(option, index) in event.options" 
        :key="index" 
        class="retro-button text-sm py-2"
        @click="makeDecision(option.effect)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.event-card {
  max-width: 560px;
  margin: 0 auto;
}

.event-title-container {
  border-radius: 4px;
  font-size: 1.2rem;
  text-shadow: 0 0 5px theme('colors.crt.glow');
  animation: text-flicker 8s infinite;
}

.nav-arrow {
  font-family: 'Press Start 2P', monospace;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-arrow:hover {
  transform: scale(1.1);
}

.event-description {
  line-height: 1.6;
  font-size: 0.9rem;
}

.event-illustration {
  image-rendering: pixelated;
  border: 3px solid theme('colors.crt.brown');
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(92, 67, 33, 0.3);
}

.pixel-event-image {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.pixelated {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.retro-button {
  width: 100%;
  font-size: 0.8rem;
}

@keyframes text-flicker {
  0% { opacity: 1; }
  3% { opacity: 0.95; }
  6% { opacity: 1; }
  8% { opacity: 0.97; }
  10% { opacity: 1; }
  50% { opacity: 1; }
  52% { opacity: 0.97; }
  54% { opacity: 1; }
  100% { opacity: 1; }
}
</style>