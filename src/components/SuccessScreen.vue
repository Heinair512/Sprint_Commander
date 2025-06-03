<script setup lang="ts">
const emit = defineEmits(['close']);

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div class="success-screen bg-crt-sepia p-4 rounded-lg shadow-lg max-w-4xl mx-auto">
    <div class="success-header bg-crt-brown text-crt-glow p-3 flex items-center justify-between mb-4 rounded">
      <div class="text-lg">🎉 Gute Entscheidung!</div>
      <button @click="handleClose" class="close-btn px-2">X</button>
    </div>
    
    <div class="success-content bg-crt-lightsep p-6 rounded-lg">
      <div class="mb-6">
        <h2 class="text-xl font-bold mb-4 text-green-700">Fokus auf das Wesentliche!</h2>
        <p class="mb-4 leading-relaxed">
          Du hast dich gegen die Push-Benachrichtigung für den CFO entschieden.
          Diese Funktion hätte erheblich mehr technische Komplexität erzeugt,
          sie hätte nur den Bedürfnissen eines einzelnen Nutzers entsprochen
          und sowohl Umsetzung als auch Wartung deutlich verteuert.
        </p>
      </div>
      
      <div class="tips bg-green-100 p-4 rounded">
        <h3 class="font-semibold mb-3">💡 Tipps für deinen nächsten Sprint:</h3>
        <ul class="list-disc list-inside space-y-3 text-sm">
          <li>
            <strong>Fokus auf Nutzergruppen:</strong> 
            Priorisiere Features, die für viele Nutzer:innen einen hohen Mehrwert haben – nicht nur für Einzelne.
          </li>
          <li>
            <strong>Schnittstellen & Wartungskosten:</strong> 
            Berücksichtige immer, wie komplex Backend-Systeme wie Firebase oder webhook‐Netzwerke später gewartet werden müssen.
          </li>
        </ul>
      </div>
      
      <button 
        @click="handleClose"
        class="w-full mt-6 py-4 bg-green-700 text-crt-glow rounded-lg hover:bg-green-600 transition-colors duration-300"
      >
        Weiter geht's! 🚀
      </button>
    </div>
  </div>
</template>

<style scoped>
.success-screen {
  font-family: 'Press Start 2P', monospace;
  font-size: 0.8rem;
}

.close-btn {
  transition: all 0.2s ease;
}

.close-btn:hover {
  transform: scale(1.1);
  opacity: 0.8;
}
</style>