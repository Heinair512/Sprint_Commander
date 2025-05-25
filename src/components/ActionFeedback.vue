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
      <!-- Event Result -->
      <div class="event-result mb-6">
        <h3 class="font-bold mb-3">Ergebnis:</h3>
        <p class="mb-4 leading-relaxed">{{ message }}</p>
      </div>
      
      <!-- General Tip -->
      <div class="general-tip mb-6 border-t-2 border-crt-brown pt-4">
        <h3 class="font-bold mb-3">Tipp für die Zukunft:</h3>
        <p class="text-sm italic">{{ tip }}</p>
      </div>
      
      <!-- Specific Tips Section -->
      <div class="specific-tips border-t-2 border-crt-brown pt-4">
        <h3 class="font-bold mb-4">Weiterführende Ressourcen:</h3>
        
        <!-- Production Outage Tips -->
        <div v-if="message.includes('Outage')" class="tips-container space-y-6">
          <div class="tip-item bg-white/50 p-4 rounded">
            <h4 class="font-bold mb-2">Incident Response Playbook</h4>
            <p class="text-sm mb-2">
              Google SRE zeigt in diesem Talk, wie man ein Playbook für den akuten Ausfall aufsetzt – inklusive Kommunikationsstruktur und Rollen.
            </p>
            <a 
              href="https://www.youtube.com/watch?v=RfnjNskapNg"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              ▶️ Google SRE Incident Response
            </a>
          </div>
          
          <div class="tip-item bg-white/50 p-4 rounded">
            <h4 class="font-bold mb-2">5 Whys-Root-Cause-Analyse</h4>
            <p class="text-sm mb-2">
              Nutze die 5 Whys-Analyse, um die wahren Ursachen eines Ausfalls zu identifizieren und nachhaltig zu beheben.
            </p>
            <a 
              href="https://www.atlassian.com/blog/teamwork/5-whys-analysis"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              📄 5 Whys Analysis Guide
            </a>
          </div>
        </div>
        
        <!-- Feature Scope Creep Tips -->
        <div v-if="message.includes('Feature')" class="tips-container space-y-6">
          <div class="tip-item bg-white/50 p-4 rounded">
            <h4 class="font-bold mb-2">MoSCoW-Priorisierung</h4>
            <p class="text-sm mb-2">
              Bevor neue Wünsche blind aufgenommen werden, hilft die MoSCoW-Priorisierung. Schau dir dieses Video an, um zu lernen, wie du Must-, Should-, Could- und Won't-Haves sauber trennst.
            </p>
            <a 
              href="https://www.youtube.com/watch?v=XVx5FKZb6l4"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              ▶️ MoSCoW Priorisierung Tutorial
            </a>
          </div>
          
          <div class="tip-item bg-white/50 p-4 rounded">
            <h4 class="font-bold mb-2">Jobs-to-be-Done-Theorie</h4>
            <p class="text-sm mb-2">
              Um Wünsche wirklich aus Anwender-Jobs abzuleiten, lohnt ein Blick in die Jobs-to-be-Done-Theorie. Sehr praxisnah erklärt von Alan Klement.
            </p>
            <a 
              href="https://www.youtube.com/watch?v=cdhra0UYILk"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              ▶️ Jobs-to-be-Done Guide
            </a>
          </div>
        </div>
        
        <!-- Sprint Planning Tips -->
        <div v-if="message.includes('Sprint')" class="tips-container space-y-6">
          <div class="tip-item bg-white/50 p-4 rounded">
            <h4 class="font-bold mb-2">Struktur & Effizienz</h4>
            <p class="text-sm mb-2">
              Ein klarer Sprint-Plan mit Zeitlimit verhindert endlose Diskussionen. Gute Best-Practices findest du in Atlassians Guide zum Sprint Planning.
            </p>
            <a 
              href="https://www.atlassian.com/agile/scrum/sprint-planning"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              ▶️ Sprint Planning Guide
            </a>
          </div>
          
          <div class="tip-item bg-white/50 p-4 rounded">
            <h4 class="font-bold mb-2">Moderation & Facilitation</h4>
            <p class="text-sm mb-2">
              Wie man ein effektives Kick-off für den Sprint plant und alle Beteiligten einbindet, zeigt dir dieses Video von Atlassian Jira Software.
            </p>
            <a 
              href="https://www.youtube.com/watch?v=69z4KZ2faxE"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              ▶️ Sprint Kick-off Tutorial
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.action-feedback {
  font-family: 'Press Start 2P', monospace;
  font-size: 0.8rem;
}

.tip-item {
  transition: all 0.2s ease;
}

.tip-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

a {
  font-family: inherit;
  transition: all 0.2s ease;
  display: inline-block;
}

a:hover {
  opacity: 0.8;
  transform: translateX(2px);
}

.close-btn {
  transition: all 0.2s ease;
}

.close-btn:hover {
  transform: scale(1.1);
  opacity: 0.8;
}
</style>