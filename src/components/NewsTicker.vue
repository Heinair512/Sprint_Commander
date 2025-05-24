<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps<{
  news: string[]
}>();

const joinedNews = ref('');
const tickerRef = ref(null);
const containerRef = ref(null);
const tickerWidth = ref(0);
const containerWidth = ref(0);
const animationDuration = ref(20);
const tickerPosition = ref(0);
const animationId = ref(null);

onMounted(() => {
  joinedNews.value = props.news.join(' • ');
  
  // Starten der Animation nach kurzem Delay, um sicherzustellen, dass DOM bereit ist
  setTimeout(() => {
    if (tickerRef.value && containerRef.value) {
      tickerWidth.value = tickerRef.value.offsetWidth;
      containerWidth.value = containerRef.value.offsetWidth;
      
      // Animation starten
      startAnimation();
    }
  }, 100);
  
  // Event-Listener für Fenstergrößenänderungen
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  
  if (animationId.value) {
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
  // Startposition (außerhalb des sichtbaren Bereichs)
  tickerPosition.value = containerWidth.value;
  
  function animate() {
    // Tickerposition aktualisieren
    tickerPosition.value -= 1.35; // Reduced from 1.5 to 1.35 (10% slower)
    
    // Wenn der Ticker vollständig aus dem Sichtbereich ist, wieder von vorne beginnen
    if (tickerPosition.value < -tickerWidth.value) {
      tickerPosition.value = containerWidth.value;
    }
    
    // Positionierung anwenden
    if (tickerRef.value) {
      tickerRef.value.style.transform = `translateX(${tickerPosition.value}px)`;
    }
    
    // Animation fortsetzen
    animationId.value = requestAnimationFrame(animate);
  }
  
  // Animation starten
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