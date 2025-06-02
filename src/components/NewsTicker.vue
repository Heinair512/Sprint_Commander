<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps<{
  news: string[]
}>();

const joinedNews = ref('');
const tickerRef = ref<HTMLElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const tickerWidth = ref(0);
const containerWidth = ref(0);
const tickerPosition = ref(0);
const animationId = ref<number | null>(null);

onMounted(() => {
  joinedNews.value = props.news.join(' • ');
  
  // Start animation after short delay to ensure DOM is ready
  setTimeout(() => {
    if (tickerRef.value && containerRef.value) {
      tickerWidth.value = tickerRef.value.offsetWidth;
      containerWidth.value = containerRef.value.offsetWidth;
      
      // Start animation
      startAnimation();
    }
  }, 100);
  
  // Event listener for window resize
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  
  if (animationId.value !== null) {
    cancelAnimationFrame(animationId.value);
  }
});

function handleResize() {
  if (tickerRef.value && containerRef.value) {
    tickerWidth.value = tickerRef.value.offsetWidth;
    containerWidth.value = containerRef.value.offsetWidth;
  }
}

function startAnimation() {
  // Starting position (outside visible area)
  tickerPosition.value = containerWidth.value;
  
  function animate() {
    // Update ticker position
    tickerPosition.value -= 1.35; // Reduced from 1.5 to 1.35 (10% slower)
    
    // Reset position when ticker is completely out of view
    if (tickerPosition.value < -tickerWidth.value) {
      tickerPosition.value = containerWidth.value;
    }
    
    // Apply positioning
    if (tickerRef.value) {
      tickerRef.value.style.transform = `translateX(${tickerPosition.value}px)`;
    }
    
    // Continue animation
    animationId.value = requestAnimationFrame(animate);
  }
  
  // Start animation
  animationId.value = requestAnimationFrame(animate);
}
</script>

<template>
  <div 
    ref="containerRef" 
    class="news-ticker border-t-4 border-crt-darkbrown relative overflow-hidden"
  >
    <div 
      ref="tickerRef" 
      class="news-ticker-content text-sm md:text-base absolute whitespace-nowrap"
    >
      {{ joinedNews }}
    </div>
  </div>
</template>

<style scoped>
.news-ticker {
  font-family: 'Press Start 2P', monospace;
  letter-spacing: 1px;
  padding: 0.75rem 0;
  background-color: theme('colors.crt.darkbrown');
  color: theme('colors.crt.glow');
  height: 3rem;
}

.news-ticker-content {
  padding: 0.25rem 0;
  text-shadow: 0 0 5px theme('colors.crt.glow');
}
</style>