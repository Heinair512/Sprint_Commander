<script setup lang="ts">
import { ref, onMounted } from 'vue';

const messages = [
  'Willkommen, angehender SprintCommander!',
  'Gratulation, du hast dich mutig in die pixelige Welt von SprintCommander gewagt. Hier übernehmen wir die Rolle des Product Owners (PO) – aber keine Angst, unser Abenteuer startet ganz klein: Du übernimmst zunächst einen überschaubaren Bereich, in dem du die Grundtechniken eines POs anhand praktischer Mini-Beispiele lernst. Keine Panik, wenn du am Anfang nur ein paar Pixel-Features jonglierst – von „simple" zu „complex" geht's Schritt für Schritt.',
  'So funktioniert\'s\nLevel 1: Rookie-PO im Anfänger-Modus',
  'Du bekommst ein kleines Backlog mit simplen Aufgaben: Eine neue Button-Farbe hier, ein Mini-API-Update dort.',
  'Deine erste Aufgabe: Halte das Team bei Laune und sorge dafür, dass die Stakeholder nicht bockig werden. (Tipp: Ein Coffee-Emoji in der Slack-Nachricht zaubert manchmal Wunder.)',
  'Ziel: Erreiche am Ende 1.000 Score-Punkte, ohne dass Team-Moral oder Stakeholder-Zufriedenheit unter 50 Punkten fallen.',
  'Verantwortung wächst mit dem Score',
  'Sobald du 1.000 Punkte eingesackt hast und dein Team sowie deine Stakeholder gut gelaunt sind, hast du das Level geschafft. Dann geht's direkt in den mittel-komplexen Bereich, wo Features enger getaktet und Stakeholder-Launen launischer werden.',
  'Je höher dein Level, desto mehr Komplexität: Von „Kann das Feature X bitte bunter leuchten?" bis hin zu „Unser größter Kunde fordert ein massives Redesign – ohne Zeitgarantie!"',
  'Moral- und Zufriedenheitsanzeige',
  'Jede Entscheidung (z. B. „Feature sofort umsetzen" oder „Zurück ins Refinement schicken") wirkt sich auf Team-Moral und Stakeholder-Zufriedenheit aus.',
  'Bleibt einer der Werte unter 50, eskaliert das Pixel-Chaos – dein Score bröckelt und das Level wird hart. Also wäge ab, ob dein Team wirklich bereit ist, den 99. Kaffeebecher-Patch einzusehen…',
  'Tipps & Tricks vom Coach',
  'Hinter jeder Entscheidung gibt's Zugriff auf wertvolle Ressourcen, die dein Wissen vertiefen, ohne dass du dich durch den Framework-Informationsjungle kämpfen musst.',
  'Kleine Rätsel innerhalb eines Events trainieren deine Priorisierungs-Skills: „Welches Feature killt zuerst dein Team-Mojo – oder schwindet die Stakeholder-Power schneller?"',
  'Dein Motto: Lerne, lache, siege, repeat',
  'Lerne die Kunst des Backlog-Managements und der Stakeholder-Kommunikation.',
  'Lache über grantige Entwickler und schräge Stakeholder-Memes.',
  'Siege, indem du 1.000 Punkte sammelst und dein Team & deine Stakeholder gut gelaunt hältst.',
  'Repeat, denn sobald du Level 1 gemeistert hast, wartet direkt der nächste, knalligere Sprint auf dich!'
];

const displayedMessages = ref<string[]>([]);
const chatContainer = ref<HTMLElement | null>(null);

const emit = defineEmits(['close']);

onMounted(() => {
  let index = 0;
  const interval = setInterval(() => {
    if (index < messages.length) {
      displayedMessages.value.push(messages[index]);
      index++;
      
      // Scroll to bottom
      setTimeout(() => {
        if (chatContainer.value) {
          chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
        }
      }, 100);
    } else {
      clearInterval(interval);
    }
  }, 2000);
});

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div class="welcome-screen bg-crt-sepia p-4 rounded-lg shadow-lg max-w-6xl mx-auto h-[80vh]">
    <div class="welcome-header bg-crt-brown text-crt-glow p-3 flex items-center justify-between mb-4 rounded">
      <div class="text-lg">Willkommen bei Sprint Commander</div>
      <button @click="handleClose" class="close-btn px-2">X</button>
    </div>
    
    <div class="welcome-content flex gap-4 h-[calc(100%-4rem)]">
      <!-- Video Section -->
      <div class="video-container w-1/2 bg-black rounded-lg overflow-hidden">
        <video 
          class="w-full h-full object-cover"
          autoplay 
          loop 
          muted 
          playsinline
        >
          <source src="/assets/instructor.mp4" type="video/mp4">
        </video>
      </div>
      
      <!-- Chat Section -->
      <div 
        ref="chatContainer"
        class="chat-container w-1/2 bg-crt-lightsep p-4 rounded overflow-y-auto"
      >
        <div 
          v-for="(message, index) in displayedMessages" 
          :key="index"
          class="chat-message mb-4 p-3 bg-crt-brown text-crt-lightsep rounded-lg"
        >
          <p class="whitespace-pre-line">{{ message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome-screen {
  font-family: 'Press Start 2P', monospace;
}

.chat-container {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.crt.darkbrown') theme('colors.crt.lightsep');
}

.chat-container::-webkit-scrollbar {
  width: 8px;
}

.chat-container::-webkit-scrollbar-track {
  background: theme('colors.crt.lightsep');
}

.chat-container::-webkit-scrollbar-thumb {
  background-color: theme('colors.crt.darkbrown');
  border-radius: 4px;
}

.chat-message {
  font-size: 0.8rem;
  line-height: 1.6;
  animation: fade-in 0.5s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>