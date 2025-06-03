<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['close']);

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div class="level-intro bg-crt-sepia p-4 rounded-lg shadow-lg max-w-4xl mx-auto">
    <div class="level-header bg-crt-brown text-crt-glow p-3 flex items-center justify-between mb-4 rounded">
      <div class="text-lg">Level 1: Die Büro-Kaffee-App</div>
      <button @click="handleClose" class="close-btn px-2">X</button>
    </div>
    
    <div class="level-content bg-crt-lightsep p-6 rounded-lg mb-6">
      <p class="mb-4">Du bist PO für die „Büro-Kaffee-App", die den Kaffeekonsum im Großraumbüro digitalisiert. Das Management fordert eine App, die anzeigt:</p>
      
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li>Wer gerade Coffee-Brew startet</li>
        <li>Wie viel Bohnenvorrat noch da ist</li>
      </ul>
      
      <p class="mb-4">Bereits beim Kick-off steigen erste Scope-Vorschläge auf:</p>
      
      <div class="team-quotes space-y-4">
        <div class="quote p-3 bg-red-100 rounded">
          <strong class="block mb-2">Maggie Money (Stakeholder):</strong>
          <p>„Wir brauchen Push-Nachrichten für den CFO, der automatisch seine Lieblingsmischung abruft und eine Push-Warnung bekommt, wenn ihm der Koffein-Pegel zu niedrig wird."</p>
        </div>
        
        <div class="quote p-3 bg-blue-100 rounded">
          <strong class="block mb-2">Grace Grid (UX):</strong>
          <p>„Wir sollten animierte Bohnen-Emojis haben und einen Dark-Mode, damit Meetings nicht blendet."</p>
        </div>
        
        <div class="quote p-3 bg-green-100 rounded">
          <strong class="block mb-2">Lars Byte (Entwickler):</strong>
          <p>„Bohnen-Emojis bedeuten zusätzlichen Asset-Download, Dark-Mode erfordert extra Styles, beides kostet Zeit. Firebase-Push erfordert Backend-Setup, das zieht Sprint-Tage."</p>
        </div>
      </div>
      
      <div class="mission mt-6 p-4 bg-yellow-100 rounded">
        <strong class="block mb-2">Deine oberste Aufgabe:</strong>
        <p>Stelle sicher, dass die Grundfunktionen (Kaffeestatus & Vorratsanzeige) im MVP landen, ohne dass Team zu stark belastet wird.</p>
      </div>
    </div>
    
    <button 
      @click="handleClose"
      class="w-full py-4 bg-green-700 text-crt-glow rounded-lg hover:bg-green-600 transition-colors duration-300"
    >
      ☕️ Auf geht's!
    </button>
  </div>
</template>

<style scoped>
.level-intro {
  font-family: 'Press Start 2P', monospace;
  font-size: 0.8rem;
  line-height: 1.6;
}

.quote {
  font-size: 0.75rem;
}

.mission {
  font-size: 0.85rem;
}
</style>