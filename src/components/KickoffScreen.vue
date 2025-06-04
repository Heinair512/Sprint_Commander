<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const emit = defineEmits(['transition']);
const showContent = ref(false);
const timeLeft = ref(30);
const timerInterval = ref<number | null>(null);
const showMeetingInfo = ref(false);
const selectedMeeting = ref<Meeting | null>(null);

interface Meeting {
  id: string;
  title: string;
  description: string;
  time: string;
  details: string;
}

const meetings = ref<Meeting[]>([
  {
    id: 'm1',
    title: 'Sprint Planning',
    description: 'Planung des nächsten Sprints für die Kaffee-App',
    time: '10:00 Uhr',
    details: 'Agenda:\n- Review des letzten Sprints\n- Kapazitätsplanung\n- Story Estimation\n- Sprint Goal Definition'
  },
  {
    id: 'm2',
    title: 'Stakeholder Meeting',
    description: 'Vorstellung des MVP-Konzepts',
    time: '14:00 Uhr',
    details: 'Teilnehmer:\n- Management Team\n- Core Entwickler\n- UX Team\n\nFokus auf ROI und Timeline'
  }
]);

interface Request {
  id: string;
  type: 'bug' | 'feature';
  title: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  reporter: string;
}

const requests = ref<Request[]>([
  {
    id: 'r1',
    type: 'bug',
    title: 'Kaffeestand-Anzeige aktualisiert sich nicht',
    priority: 'high',
    description: 'Die Bohnenvorrats-Anzeige bleibt bei 100%, auch wenn Kaffee gebrüht wird.',
    reporter: 'Lars Byte'
  },
  {
    id: 'r2',
    type: 'feature',
    title: 'Statistik-Dashboard',
    priority: 'medium',
    description: 'Übersicht über Kaffeekonsum und Nachfüll-Zyklen',
    reporter: 'Grace Grid'
  }
]);

const handleClose = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
  emit('transition');
};

const showMeetingDetails = (meeting: Meeting) => {
  selectedMeeting.value = meeting;
  showMeetingInfo.value = true;
};

const closeMeetingDetails = () => {
  showMeetingInfo.value = false;
  selectedMeeting.value = null;
};

const handleMeetingResponse = (meetingId: string, attending: boolean) => {
  meetings.value = meetings.value.filter(m => m.id !== meetingId);
  // Hier später: Metriken aktualisieren basierend auf der Entscheidung
};

const handleRequest = (requestId: string, accepted: boolean) => {
  requests.value = requests.value.filter(r => r.id !== requestId);
  // Hier später: Metriken aktualisieren basierend auf der Entscheidung
};

onMounted(() => {
  showContent.value = true;
  
  timerInterval.value = window.setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) {
      if (timerInterval.value) {
        clearInterval(timerInterval.value);
      }
      emit('transition');
    }
  }, 1000);
});

onBeforeUnmount(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});
</script>

<template>
  <div class="kickoff-screen h-screen bg-crt-sepia p-4">
    <div class="grid grid-cols-3 gap-4 h-full">
      <!-- Info Window -->
      <div class="window bg-crt-lightsep rounded-lg overflow-hidden">
        <div class="window-header bg-crt-brown text-crt-glow p-3 flex items-center justify-between">
          <div class="text-sm">📋 Mission Briefing</div>
          <button @click="handleClose" class="close-btn px-2">X</button>
        </div>
        <div class="window-content p-4 text-sm">
          <p class="mb-4">Du startest als Product Owner für die „Büro-Kaffee-App". Deine Mission:</p>
          <ul class="list-disc pl-4 space-y-2">
            <li>Entwickle eine App für den Kaffeekonsum im Büro</li>
            <li>Zeige an, wer gerade Kaffee brüht</li>
            <li>Überwache den Bohnenvorrat</li>
          </ul>
          <div class="mt-4 text-xs text-right">
            Verbleibende Zeit: {{ timeLeft }}s
          </div>
        </div>
      </div>

      <!-- Meeting Channel -->
      <div class="window bg-crt-lightsep rounded-lg overflow-hidden">
        <div class="window-header bg-crt-brown text-crt-glow p-3">
          <div class="text-sm">📅 Meeting Channel</div>
        </div>
        <div class="window-content p-4 overflow-y-auto">
          <div v-for="meeting in meetings" :key="meeting.id" class="meeting-card bg-white/50 p-4 rounded-lg mb-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-sm">{{ meeting.title }}</h3>
              <span class="text-xs">{{ meeting.time }}</span>
            </div>
            <p class="text-sm mb-3">{{ meeting.description }}</p>
            <div class="flex items-center justify-between">
              <button 
                class="text-xs underline text-blue-600 hover:text-blue-800"
                @click="showMeetingDetails(meeting)"
              >
                Details anzeigen
              </button>
              <div class="space-x-2">
                <button 
                  class="px-3 py-1 bg-green-600 text-white rounded text-xs"
                  @click="handleMeetingResponse(meeting.id, true)"
                >
                  Ich geh hin
                </button>
                <button 
                  class="px-3 py-1 bg-red-600 text-white rounded text-xs"
                  @click="handleMeetingResponse(meeting.id, false)"
                >
                  Ohne mich
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Request Channel -->
      <div class="window bg-crt-lightsep rounded-lg overflow-hidden">
        <div class="window-header bg-crt-brown text-crt-glow p-3">
          <div class="text-sm">🔧 Request Channel</div>
        </div>
        <div class="window-content p-4 overflow-y-auto">
          <div v-for="request in requests" :key="request.id" class="request-card bg-white/50 p-4 rounded-lg mb-4">
            <div class="flex justify-between items-start mb-2">
              <div>
                <span 
                  class="inline-block px-2 py-1 rounded text-xs mr-2"
                  :class="{
                    'bg-red-100 text-red-800': request.type === 'bug',
                    'bg-blue-100 text-blue-800': request.type === 'feature'
                  }"
                >
                  {{ request.type === 'bug' ? 'Bug' : 'Feature' }}
                </span>
                <span 
                  class="inline-block px-2 py-1 rounded text-xs"
                  :class="{
                    'bg-red-100 text-red-800': request.priority === 'high',
                    'bg-yellow-100 text-yellow-800': request.priority === 'medium',
                    'bg-green-100 text-green-800': request.priority === 'low'
                  }"
                >
                  {{ request.priority }}
                </span>
              </div>
              <span class="text-xs">von {{ request.reporter }}</span>
            </div>
            <h3 class="font-bold text-sm mb-2">{{ request.title }}</h3>
            <p class="text-sm mb-3">{{ request.description }}</p>
            <div class="flex justify-end space-x-2">
              <button 
                class="px-3 py-1 bg-green-600 text-white rounded text-xs"
                @click="handleRequest(request.id, true)"
              >
                Annehmen
              </button>
              <button 
                class="px-3 py-1 bg-red-600 text-white rounded text-xs"
                @click="handleRequest(request.id, false)"
              >
                Ablehnen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Meeting Details Overlay -->
    <div 
      v-if="showMeetingInfo" 
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeMeetingDetails"
    >
      <div class="bg-crt-lightsep p-6 rounded-lg max-w-lg w-full mx-4">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-lg font-bold">{{ selectedMeeting?.title }}</h2>
          <button 
            @click="closeMeetingDetails"
            class="text-gray-500 hover:text-gray-700"
          >
            X
          </button>
        </div>
        <div class="mb-4">
          <p class="text-sm mb-2">Zeit: {{ selectedMeeting?.time }}</p>
          <p class="text-sm mb-4">{{ selectedMeeting?.description }}</p>
          <pre class="text-xs bg-white/50 p-4 rounded whitespace-pre-wrap">{{ selectedMeeting?.details }}</pre>
        </div>
        <div class="flex justify-end">
          <button 
            @click="closeMeetingDetails"
            class="px-4 py-2 bg-crt-brown text-crt-glow rounded text-sm"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kickoff-screen {
  font-family: 'Press Start 2P', monospace;
}

.window {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.window-content {
  flex-grow: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: theme('colors.crt.brown') theme('colors.crt.lightsep');
}

.window-content::-webkit-scrollbar {
  width: 6px;
}

.window-content::-webkit-scrollbar-track {
  background: theme('colors.crt.lightsep');
}

.window-content::-webkit-scrollbar-thumb {
  background-color: theme('colors.crt.brown');
  border-radius: 3px;
}

.meeting-card,
.request-card {
  transition: transform 0.2s ease;
}

.meeting-card:hover,
.request-card:hover {
  transform: translateY(-2px);
}

button {
  transition: all 0.2s ease;
}

button:hover {
  opacity: 0.9;
}

.close-btn:hover {
  transform: scale(1.1);
}
</style>