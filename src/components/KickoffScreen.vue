<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useScoreStore } from '../stores/scoreStore';

const emit = defineEmits(['transition']);
const showContent = ref(false);
const timeLeft = ref(120);
const timerInterval = ref<number | null>(null);
const showMeetingInfo = ref(false);
const selectedMeeting = ref<Meeting | null>(null);
const scoreStore = useScoreStore();

interface Meeting {
  id: string;
  title: string;
  description: string;
  time: string;
  details: string;
  duration: number; // in minutes
}

const meetings = ref<Meeting[]>([
  {
    id: 'm1',
    title: 'Sprint Planning',
    description: 'Planung des nächsten Sprints für die Kaffee-App',
    time: '10:00 Uhr',
    details: 'Agenda:\n- Review des letzten Sprints\n- Kapazitätsplanung\n- Story Estimation\n- Sprint Goal Definition',
    duration: 120
  },
  {
    id: 'm2',
    title: 'Stakeholder Meeting',
    description: 'Vorstellung des MVP-Konzepts',
    time: '14:00 Uhr',
    details: 'Teilnehmer:\n- Management Team\n- Core Entwickler\n- UX Team\n\nFokus auf ROI und Timeline',
    duration: 60
  },
  {
    id: 'm3',
    title: 'Daily mit dem Team',
    description: 'Tägliches Stand-up Meeting',
    time: '09:30 Uhr',
    details: 'Agenda:\n- Was wurde gestern erreicht?\n- Was ist für heute geplant?\n- Gibt es Blockaden?',
    duration: 15
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

interface RoadmapItem {
  id: string;
  week: number;
  title: string;
  description: string;
  type: 'feature' | 'milestone' | 'release';
}

const roadmapItems = ref<RoadmapItem[]>([
  // Week 1-2: MVP
  { id: 'r1', week: 1, title: 'Basis Setup', description: 'Projekt-Setup & CI/CD Pipeline', type: 'milestone' },
  { id: 'r2', week: 1, title: 'Brew Status', description: 'Anzeige des aktuellen Brühvorgangs', type: 'feature' },
  { id: 'r3', week: 2, title: 'Bean Level', description: 'Bohnenvorrats-Monitoring', type: 'feature' },
  { id: 'r4', week: 2, title: 'MVP Release', description: 'Erste produktive Version', type: 'release' },
  
  // Week 3-4: Erweiterungen
  { id: 'r5', week: 3, title: 'User Profiles', description: 'Persönliche Kaffee-Präferenzen', type: 'feature' },
  { id: 'r6', week: 3, title: 'Statistics', description: 'Basis-Statistiken implementieren', type: 'feature' },
  { id: 'r7', week: 4, title: 'Dark Mode', description: 'Dunkles Farbschema für die UI', type: 'feature' },
  
  // Week 5-6: Analytics
  { id: 'r8', week: 5, title: 'Analytics', description: 'Erweiterte Verbrauchsanalyse', type: 'feature' },
  { id: 'r9', week: 5, title: 'Predictions', description: 'KI-basierte Verbrauchsvorhersage', type: 'feature' },
  { id: 'r10', week: 6, title: 'V2 Release', description: 'Analytics Update Release', type: 'release' }
]);

// Add new refs for animation
const animatingRequest = ref<Request | null>(null);
const animationTarget = ref<{ week: number; position: number } | null>(null);

// Compute available slots in roadmap
const availableSlots = computed(() => {
  const slots: Record<number, number> = {};
  for (let week = 1; week <= 52; week++) {
    const itemsInWeek = roadmapItems.value.filter(i => i.week === week).length;
    slots[week] = 3 - itemsInWeek; // Maximum 3 items per week
  }
  return slots;
});

// Find next available slot
const findNextSlot = () => {
  for (let week = 1; week <= 52; week++) {
    if (availableSlots.value[week] > 0) {
      return {
        week,
        position: 3 - availableSlots.value[week]
      };
    }
  }
  return null;
};

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

const handleMeetingResponse = (meeting: Meeting, attending: boolean) => {
  if (attending) {
    scoreStore.addMeetingTime(meeting.duration);
  } else if (meeting.title === 'Daily mit dem Team') {
    // Reduce team morale and outcome when skipping daily
    Object.keys(scoreStore.scores).forEach(memberId => {
      const currentScore = scoreStore.getMemberScore(memberId);
      scoreStore.updateMemberScore(
        memberId,
        currentScore.teamMorale - 10,
        currentScore.stakeholderSatisfaction
      );
    });
    scoreStore.skipMeeting(5); // Reduce outcome by 5%
  }
  
  meetings.value = meetings.value.filter(m => m.id !== meeting.id);
};

const handleRequest = async (requestId: string, accepted: boolean) => {
  const request = requests.value.find(r => r.id === requestId);
  if (!request || !accepted) {
    requests.value = requests.value.filter(r => r.id !== requestId);
    return;
  }

  // Find next available slot
  const slot = findNextSlot();
  if (!slot) {
    requests.value = requests.value.filter(r => r.id !== requestId);
    return;
  }

  // Set up animation
  animatingRequest.value = request;
  animationTarget.value = slot;

  // Create new roadmap item
  const newItem: RoadmapItem = {
    id: `roadmap-${request.id}`,
    week: slot.week,
    title: request.title,
    description: request.description,
    type: request.type === 'bug' ? 'milestone' : 'feature'
  };

  // Wait for animation
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Add to roadmap
  roadmapItems.value.push(newItem);

  // Clean up
  animatingRequest.value = null;
  animationTarget.value = null;
  requests.value = requests.value.filter(r => r.id !== requestId);
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
  <div class="kickoff-screen flex-grow bg-crt-sepia p-4">
    <!-- Roadmap Section -->
    <div class="roadmap-section mb-4 bg-crt-lightsep rounded-lg overflow-hidden">
      <div class="window-header bg-crt-brown text-crt-glow p-3">
        <div class="text-sm">🗺️ Roadmap</div>
      </div>
      <div class="roadmap-container p-4 overflow-x-auto">
        <div class="roadmap-timeline" style="width: max-content; min-width: 100%;">
          <div class="flex">
            <div 
              v-for="week in 52" 
              :key="week"
              class="week-column min-w-[200px] border-r border-crt-brown/20 relative"
            >
              <div class="week-header text-xs mb-2 sticky top-0">
                Woche {{ week }}
              </div>
              <div class="week-items space-y-2">
                <div 
                  v-for="item in roadmapItems.filter(i => i.week === week)"
                  :key="item.id"
                  class="roadmap-item p-2 rounded"
                  :class="{
                    'bg-blue-100': item.type === 'feature',
                    'bg-yellow-100': item.type === 'milestone',
                    'bg-green-100': item.type === 'release'
                  }"
                >
                  <div class="text-xs font-bold mb-1">{{ item.title }}</div>
                  <div class="text-xs">{{ item.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4 h-[calc(100%-12rem)]">
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
                  @click="handleMeetingResponse(meeting, true)"
                >
                  Ich geh hin
                </button>
                <button 
                  class="px-3 py-1 bg-red-600 text-white rounded text-xs"
                  @click="handleMeetingResponse(meeting, false)"
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
          <div v-for="request in requests" :key="request.id" 
               class="request-card bg-white/50 p-4 rounded-lg mb-4"
               :class="{ 'animating': animatingRequest?.id === request.id }"
          >
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

    <!-- Animating request overlay -->
    <div 
      v-if="animatingRequest"
      class="fixed pointer-events-none"
      :style="{
        transform: `translate(${animationTarget ? animationTarget.week * 200 : 0}px, ${animationTarget ? animationTarget.position * 60 : 0}px)`,
        transition: 'all 1s ease'
      }"
    >
      <div class="request-card bg-white/50 p-4 rounded-lg">
        <div class="text-xs font-bold mb-1">{{ animatingRequest.title }}</div>
        <div class="text-xs">{{ animatingRequest.description }}</div>
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

.roadmap-container {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.crt.brown') theme('colors.crt.lightsep');
  height: 200px;
  overflow-y: hidden;
}

.roadmap-container::-webkit-scrollbar {
  height: 6px;
}

.roadmap-container::-webkit-scrollbar-track {
  background: theme('colors.crt.lightsep');
}

.roadmap-container::-webkit-scrollbar-thumb {
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

.request-card.animating {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.roadmap-item {
  transition: all 0.3s ease;
}

.roadmap-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>