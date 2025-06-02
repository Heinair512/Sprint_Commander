<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMediaControls } from '@vueuse/core';

const displayedMessages = ref<string[]>([]);
const chatContainer = ref<HTMLElement | null>(null);
const showLetsGoButton = ref(false);
const videoRef = ref<HTMLVideoElement | null>(null);

const { playing, toggle } = useMediaControls(videoRef, {
  src: '/assets/instructor.mp4',
  autoplay: true,
});

const emit = defineEmits(['close']);

const messages = [
  '👋 Willkommen, angehender SprintCommander!',
  
  'Gratulation, du hast dich mutig in die pixelige Welt von SprintCommander gewagt.\n\nHier übernehmen wir die Rolle des Product Owners (PO) – aber keine Angst, unser Abenteuer startet ganz klein: Du übernimmst zunächst einen überschaubaren Bereich, in dem du die Grundtechniken eines POs anhand praktischer Mini-Beispiele lernst.\n\nKeine Panik, wenn du am Anfang nur ein paar Pixel-Features jonglierst – von „simple" zu „complex" geht\'s Schritt für Schritt.',
  
  '🎮 So funktioniert\'s\n\nLevel 1: Rookie-PO im Anfänger-Modus',
  
  'Du bekommst ein kleines Backlog mit simplen Aufgaben:\n• Eine neue Button-Farbe hier\n• Ein Mini-API-Update dort',
  
  '📋 Deine erste Aufgabe:\nHalte das Team bei Laune und sorge dafür, dass die Stakeholder nicht bockig werden.\n\n(Tipp: Ein ☕️ Coffee-Emoji in der Slack-Nachricht zaubert manchmal Wunder.)',
  
  '🎯 Ziel:\nErreiche am Ende 1.000 Score-Punkte, ohne dass Team-Moral oder Stakeholder-Zufriedenheit unter 50 Punkten fallen.',
  
  '📈 Verantwortung wächst mit dem Score',
  
  'Sobald du 1.000 Punkte eingesackt hast und dein Team sowie deine Stakeholder gut gelaunt sind, hast du das Level geschafft.\n\nDann geht\'s direkt in den mittel-komplexen Bereich, wo Features enger getaktet und Stakeholder-Launen launischer werden.',
  
  'Je höher dein Level, desto mehr Komplexität:\n• Von „Kann das Feature X bitte bunter leuchten?"\n• Bis hin zu „Unser größter Kunde fordert ein massives Redesign – ohne Zeitgarantie!"',
  
  '📊 Moral- und Zufriedenheitsanzeige',
  
  'Jede Entscheidung wirkt sich auf Team-Moral und Stakeholder-Zufriedenheit aus.\n\nBeispiele:\n• „Feature sofort umsetzen"\n• „Zurück ins Refinement schicken"',
  
  '⚠️ Wichtig:\nBleibt einer der Werte unter 50, eskaliert das Pixel-Chaos – dein Score bröckelt und das Level wird hart.\n\nAlso wäge ab, ob dein Team wirklich bereit ist, den 99. Kaffeebecher-Patch einzusehen…',
  
  '🎓 Tipps & Tricks vom Coach',
  
  'Hinter jeder Entscheidung gibt\'s Zugriff auf wertvolle Ressourcen, die dein Wissen vertiefen, ohne dass du dich durch den Framework-Informationsjungle kämpfen musst.',
  
  '🧩 Kleine Rätsel innerhalb eines Events trainieren deine Priorisierungs-Skills:\n„Welches Feature killt zuerst dein Team-Mojo – oder schwindet die Stakeholder-Power schneller?"',
  
  '🚀 Dein Motto: Lerne, lache, siege, repeat',
  
  '📚 Lerne die Kunst des Backlog-Managements und der Stakeholder-Kommunikation.',
  
  '😄 Lache über grantige Entwickler und schräge Stakeholder-Memes.',
  
  '🏆 Siege, indem du 1.000 Punkte sammelst und dein Team & deine Stakeholder gut gelaunt hältst.',
  
  '🔄 Repeat, denn sobald du Level 1 gemeistert hast, wartet direkt der nächste, knalligere Sprint auf dich!'
];

onMounted(() => {
  let index = 0;
  const baseDelay = 5500;

  const showNextGroup = () => {
    if (index >= messages.length) {
      showLetsGoButton.value = true;
      return;
    }
    
    // Clear messages for new sections
    if (index === 0 || // Start
        index === 2 || // "So funktioniert's"
        index === 6 || // "Verantwortung wächst"
        index === 9 || // "Moral- und Zufriedenheitsanzeige"
        index === 12 || // "Tipps & Tricks"
        index === 15) { // "Dein Motto"
      displayedMessages.value = [];
    }
    
    const isFirstGroup = index < 2;
    const isScoreSection = index >= 6 && index < 15;
    const isMotto = index >= 15;
    
    const showMessagesInGroup = () => {
      if (index < messages.length) {
        displayedMessages.value.push(messages[index]);
        
        setTimeout(() => {
          if (chatContainer.value) {
            chatContainer.value.scrollTo({
              top: chatContainer.value.scrollHeight,
              behavior: 'smooth'
            });
          }
        }, 100);
        
        index++;
        
        // Determine next message timing
        let nextDelay;
        if (isFirstGroup) {
          nextDelay = baseDelay * 1.3; // 30% longer for first group
        } else if (index >= 2 && index <= 6) {
          nextDelay = baseDelay * 0.7; // 30% faster for "so funktioniert's" to "Verantwortung"
        } else if (isScoreSection) {
          nextDelay = baseDelay * 1.2; // 20% longer for score section
        } else if (isMotto) {
          nextDelay = baseDelay * 0.8; // Slightly faster for motto section
        } else {
          nextDelay = baseDelay;
        }
        
        if ((isFirstGroup && index < 2) || 
            (isScoreSection && index < 15) || 
            (isMotto && index < messages.length)) {
          setTimeout(showMessagesInGroup, nextDelay);
        } else if (!isMotto) {
          // Longer pause before next section
          setTimeout(showNextGroup, baseDelay * 2);
        } else {
          // Show Let's Go button after last message
          setTimeout(() => {
            showLetsGoButton.value = true;
          }, baseDelay);
        }
      }
    };
    
    showMessagesInGroup();
  };
  
  showNextGroup();
});

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div class="welcome-screen bg-crt-sepia p-4 rounded-lg shadow-lg max-w-6xl mx-auto h-[80vh]">
    <div class="welcome-header bg-crt-brown text-crt-glow p-3 flex items-center justify-between mb-4 rounded">
      <div class="text-lg">Willkommen Sprint Commander</div>
      <button @click="handleClose" class="close-btn px-2">X</button>
    </div>
    
    <div class="welcome-content flex gap-4 h-[calc(100%-4rem)]">
      <!-- Video Section -->
      <div class="video-container w-1/2 bg-black rounded-lg overflow-hidden">
        <video 
          ref="videoRef"
          class="w-full h-full object-cover"
          :autoplay="true"
          loop 
          muted 
          playsinline
        >
          <source src="/assets/instructor.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
      
      <!-- Chat Section -->
      <div 
        ref="chatContainer"
        class="chat-container w-1/2 bg-crt-lightsep p-4 rounded overflow-y-auto relative"
      >
        <div 
          v-for="(message, index) in displayedMessages" 
          :key="index"
          class="chat-message mb-4 p-3 bg-crt-brown text-crt-lightsep rounded-lg"
        >
          <p class="whitespace-pre-line">{{ message }}</p>
        </div>
        
        <!-- Let's Go Button -->
        <button 
          v-if="showLetsGoButton"
          @click="handleClose"
          class="lets-go-button w-full py-4 mt-6 bg-crt-brown text-crt-glow rounded-lg hover:bg-crt-darkbrown transition-colors duration-300"
        >
          🚀 Let's Go!
        </button>
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
  line-height: 1.8;
  animation: fade-in 0.8s ease-out;
}

.lets-go-button {
  animation: fade-in 1s ease-out;
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