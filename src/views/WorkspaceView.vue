<script setup lang="ts">
import { ref } from 'vue';
import { useScoreStore } from '../stores/scoreStore';
import HeaderBar from '../components/HeaderBar.vue';
import NewsTicker from '../components/NewsTicker.vue';
import news from '../data/news.json';

const scoreStore = useScoreStore();
const score = ref(0);
const missionTitle = ref('Büro-Kaffee-App');
const level = ref('Level 1');

interface Meeting {
  id: string;
  title: string;
  description: string;
  duration: number;
  outcomeImpact: number;
}

const meetings = ref<Meeting[]>([
  {
    id: 'm1',
    title: 'Daily Standup',
    description: 'Tägliches Team-Update',
    duration: 15,
    outcomeImpact: 5
  },
  {
    id: 'm2',
    title: 'Sprint Planning',
    description: 'Planung des nächsten Sprints',
    duration: 120,
    outcomeImpact: 15
  }
]);

const handleMeeting = (meeting: Meeting, attend: boolean) => {
  if (attend) {
    if (scoreStore.getWMTPercentage + (meeting.duration / 480 * 100) > 100) {
      toast.error('Keine Zeit mehr für weitere Meetings diese Woche!');
      return;
    }
    scoreStore.addMeetingTime(meeting.duration);
  } else {
    scoreStore.skipMeeting(meeting.outcomeImpact);
  }
  meetings.value = meetings.value.filter(m => m.id !== meeting.id);
};

const handleNavigate = (screen: 'workspace' | 'game') => {
  if (screen === 'game') {
    router.push('/');
  }
};
</script>

<template>
  <div class="workspace-container bg-crt-bg min-h-screen flex flex-col">
    <HeaderBar 
      :missionTitle="missionTitle" 
      :score="score" 
      :level="level"
      @navigate="handleNavigate"
    />
    
    <div class="grid grid-cols-2 gap-4 p-4 flex-grow">
      <!-- Meetings Panel -->
      <div class="bg-crt-sepia rounded-lg p-4">
        <h2 class="text-lg mb-4 text-crt-darkbrown">📅 Meetings</h2>
        <div class="space-y-4">
          <div 
            v-for="meeting in meetings" 
            :key="meeting.id"
            class="bg-crt-lightsep p-4 rounded-lg"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold">{{ meeting.title }}</h3>
              <span class="text-sm">{{ meeting.duration }}min</span>
            </div>
            <p class="text-sm mb-4">{{ meeting.description }}</p>
            <div class="flex justify-end space-x-2">
              <button 
                @click="handleMeeting(meeting, true)"
                class="px-3 py-1 bg-green-600 text-white rounded text-xs"
                :disabled="!scoreStore.canMakeDecisions"
              >
                Teilnehmen
              </button>
              <button 
                @click="handleMeeting(meeting, false)"
                class="px-3 py-1 bg-red-600 text-white rounded text-xs"
              >
                Absagen
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Requests Panel -->
      <div class="bg-crt-sepia rounded-lg p-4">
        <h2 class="text-lg mb-4 text-crt-darkbrown">🔧 Requests</h2>
        <!-- Request content will be added later -->
      </div>
    </div>

    <NewsTicker :news="news" class="mt-auto" />
  </div>
</template>

<style scoped>
.workspace-container {
  font-family: 'Press Start 2P', monospace;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>