```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const emit = defineEmits(['transition']);
const showContent = ref(false);

onMounted(() => {
  showContent.value = true;
  setTimeout(() => {
    emit('transition');
  }, 20000);
});
</script>

<template>
  <div class="kickoff-screen bg-crt-sepia p-4 rounded-lg shadow-lg max-w-4xl mx-auto">
    <div class="kickoff-header bg-crt-brown text-crt-glow p-3 mb-4 rounded">
      <div class="text-lg text-center">Kick-off Meeting: Büro-Kaffee-App</div>
    </div>
    
    <div 
      class="kickoff-content bg-crt-lightsep p-6 rounded-lg"
      :class="{ 'fade-in': showContent }"
    >
      <div class="text-content mb-8">
        <p class="mb-4">
          Du sitzt im Café um die Ecke, dein Laptop bereit, und heute startest du als Product Owner für die „Büro-Kaffee-App". Auf deinem Screen flimmern die Basis-Kennzahlen:
        </p>
        
        <div class="stats-display bg-crt-brown/20 p-4 rounded-lg mb-6">
          <pre class="font-mono text-sm">
Score: 0
Outcome: 0 % (kein MVP live)
Burden: 0 % (Team frei)
Team-Moral: alle bei 0
Stakeholder-Moral: 0</pre>
        </div>
        
        <p class="mb-6">
          Gleich beginnt das Kick-off im hölzernen Konferenzraum: Lars Byte, der API-Entwickler, zappt mit seinem MacBook-Stick, Grace Grid, UX-Designerin, hält Wireframe-Skizzen bereit, Scrumlius, der Agile Coach, lehnt sich lächelnd zurück – Pocket-Guide für Priorisierung in der Tasche. Maggie Money, Stakeholderin aus der Geschäftsführung, blickt erwartungsvoll auf ihr Tablet.
        </p>
      </div>
      
      <!-- Retro ASCII Art Diagram -->
      <div class="diagram-container bg-black/10 p-4 rounded-lg mb-6 font-mono text-xs leading-tight whitespace-pre overflow-x-auto">
        <pre class="text-center">
╔══════════════════════════════════════╗
║           KAFFEE-APP MVP             ║
╠══════════════════════════════════════╣
║                                      ║
║    [ Brew Status ]    [ Inventory ]  ║
║         |                  |         ║
║         v                  v         ║
║   Who's brewing?    Bean Level OK?   ║
║         |                  |         ║
║         v                  v         ║
║     Notification      Auto-Order     ║
║                                      ║
╚══════════════════════════════════════╝
        </pre>
      </div>
      
      <div class="objectives bg-crt-brown/20 p-4 rounded-lg">
        <h3 class="font-bold mb-3">Kernfunktionen:</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li>Wer brüht gerade Kaffee?</li>
          <li>Wie viel Bohnenvorrat ist noch da?</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kickoff-screen {
  font-family: 'Press Start 2P', monospace;
  font-size: 0.8rem;
  line-height: 1.6;
}

.fade-in {
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.diagram-container {
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: theme('colors.crt.brown') theme('colors.crt.lightsep');
}

.diagram-container::-webkit-scrollbar {
  height: 6px;
}

.diagram-container::-webkit-scrollbar-track {
  background: theme('colors.crt.lightsep');
}

.diagram-container::-webkit-scrollbar-thumb {
  background-color: theme('colors.crt.brown');
  border-radius: 3px;
}
</style>
```