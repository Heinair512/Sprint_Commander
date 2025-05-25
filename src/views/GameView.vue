<script setup lang="ts">
import { ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useScoreStore } from '../stores/scoreStore';
import HeaderBar from '../components/HeaderBar.vue';
import TeamPortrait from '../components/TeamPortrait.vue';
import MainView from '../components/MainView.vue';
import NewsTicker from '../components/NewsTicker.vue';
import TeamChat from '../components/TeamChat.vue';
import ActionFeedback from '../components/ActionFeedback.vue';
import team from '../data/team.json';
import events from '../data/events.json';
import news from '../data/news.json';

const emit = defineEmits(['logout']);
const toast = useToast();
const score = ref(825);
const missionTitle = ref('Black Friday');
const level = ref('Jira Login');
const activeTeamMember = ref(null);
const currentEventIndex = ref(0);
const currentEvent = ref(events[currentEventIndex.value]);
const showChat = ref(false);
const showTeamChat = ref(false);
const showActionFeedback = ref(false);
const scoreStore = useScoreStore();

const handleLogout = () => {
  emit('logout');
  toast.success('Erfolgreich ausgeloggt!', {
    timeout: 2000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    icon: '/assets/mood/happy.png'
  });
};

const navigateEvent = (direction: 'prev' | 'next') => {
  if (direction === 'prev') {
    currentEventIndex.value = currentEventIndex.value > 0 ? currentEventIndex.value - 1 : events.length - 1;
  } else {
    currentEventIndex.value = currentEventIndex.value < events.length - 1 ? currentEventIndex.value + 1 : 0;
  }
  currentEvent.value = events[currentEventIndex.value];
  showTeamChat.value = false;
  showActionFeedback.value = false;
};

const updateMoods = (teamChange: number, stakeholderChange: number) => {
  const currentTeamMorale = scoreStore.teamMorale;
  const currentStakeholderSatisfaction = scoreStore.stakeholderSatisfaction;
  
  scoreStore.updateTeamMorale(Math.max(-100, Math.min(100, currentTeamMorale + teamChange)));
  scoreStore.updateStakeholderSatisfaction(Math.max(-100, Math.min(100, currentStakeholderSatisfaction + stakeholderChange)));
};

const makeDecision = (effect: number) => {
  const scoreElement = document.querySelector('.score');
  
  switch(currentEvent.value.id) {
    case 'event-1':
      if (effect === 5) {
        score.value += 50;
        scoreElement?.classList.add('success');
        setTimeout(() => scoreElement?.classList.remove('success'), 1000);
        
        updateMoods(-10, 15);
        
        toast.success("Sehr gute Entscheidung, das sollten wir uns angucken -> +50 Punkte", {
          timeout: 3000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          icon: '/assets/mood/happy.png'
        });
        showTeamChat.value = true;
      } else {
        score.value -= 50;
        scoreElement?.classList.add('error');
        setTimeout(() => scoreElement?.classList.remove('error'), 1000);
        
        updateMoods(5, -20);
        
        toast.error("Mutig, aber: dumm. -50 Punkte", {
          timeout: 3000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          icon: '/assets/mood/sad.png'
        });
        showActionFeedback.value = true;
      }
      break;
      
    case 'event-2':
      if (effect === 5) {
        score.value += 50;
        scoreElement?.classList.add('success');
        setTimeout(() => scoreElement?.classList.remove('success'), 1000);
        
        updateMoods(15, -10);
        
        toast.success("Kluge Entscheidung! Qualität vor Quantität -> +50 Punkte", {
          timeout: 3000,
          icon: '/assets/mood/happy.png'
        });
        showTeamChat.value = true;
      } else {
        score.value -= 50;
        scoreElement?.classList.add('error');
        setTimeout(() => scoreElement?.classList.remove('error'), 1000);
        
        updateMoods(-15, 10);
        
        toast.error("Oh je, das wird stressig! -50 Punkte", {
          timeout: 3000,
          icon: '/assets/mood/sad.png'
        });
        showActionFeedback.value = true;
      }
      break;
      
    case 'event-3':
      if (effect === 10) {
        score.value += 50;
        scoreElement?.classList.add('success');
        setTimeout(() => scoreElement?.classList.remove('success'), 1000);
        
        updateMoods(10, 5);
        
        toast.success("Datenbasierte Entscheidung! Super! -> +50 Punkte", {
          timeout: 3000,
          icon: '/assets/mood/happy.png'
        });
        showTeamChat.value = true;
      } else {
        score.value -= 50;
        scoreElement?.classList.add('error');
        setTimeout(() => scoreElement?.classList.remove('error'), 1000);
        
        updateMoods(-20, -10);
        
        toast.error("Übermut tut selten gut! -50 Punkte", {
          timeout: 3000,
          icon: '/assets/mood/sad.png'
        });
        showActionFeedback.value = true;
      }
      break;
  }
};

const selectTeamMember = (member) => {
  activeTeamMember.value = member;
  showChat.value = true;
};

const closeChat = () => {
  showChat.value = false;
  activeTeamMember.value = null;
};

const closeTeamChat = () => {
  showTeamChat.value = false;
};

const closeActionFeedback = () => {
  showActionFeedback.value = false;
};
</script>

<template>
  <div class="game-container bg-crt-bg min-h-screen flex flex-col">
    <HeaderBar 
      :missionTitle="missionTitle" 
      :score="score" 
      :level="level"
      @logout="handleLogout"
    />
    
    <div class="flex-grow flex flex-col md:flex-row">
      <!-- Linke Teammitglieder -->
      <div class="team-left w-full md:w-1/4 lg:w-1/5 flex flex-row md:flex-col justify-around md:justify-start p-4">
        <TeamPortrait 
          v-for="member in team.slice(0, 2)" 
          :key="member.id" 
          :member="member" 
          @click="selectTeamMember(member)"
        />
      </div>
      
      <!-- Hauptbereich -->
      <div class="main-area flex-grow md:w-1/2 lg:w-3/5 p-4">
        <ActionFeedback
          v-if="showActionFeedback"
          :message="currentEvent.id === 'event-1' 
            ? 'Du hast ganz Achtsam die Ruhe bewahrt, was dir dein Team sehr dankt. Leider sind durch die Outage 5000 Bestellungen verloren gegangen, was deinem Unternehmen 5 Millionen Verlust eingebracht hat.'
            : currentEvent.id === 'event-2'
            ? 'Das Team ist überfordert und die Qualität leidet. Mehrere kritische Bugs haben es in die Produktion geschafft.'
            : 'Das Team ist demotiviert und der Sprint ist gescheitert. Die Velocity ist auf einem Allzeittief.'"
          :tip="currentEvent.id === 'event-1'
            ? 'Es ist wichtig am Anfang schnell zu reagieren um die Kritikalität besser einschätzen zu können. Ruhig aber zügig.'
            : currentEvent.id === 'event-2'
            ? 'Lieber weniger Features richtig umsetzen als viele Features schlecht.'
            : 'Vertraue den Daten und der Erfahrung des Teams.'"
          @close="closeActionFeedback"
        />
        <TeamChat 
          v-else-if="showTeamChat"
          :event="currentEvent"
          :team="team"
          @close="closeTeamChat"
        />
        <MainView 
          v-else
          :currentEvent="currentEvent" 
          :showChat="showChat" 
          :activeTeamMember="activeTeamMember"
          @make-decision="makeDecision" 
          @close-chat="closeChat"
          @navigate="navigateEvent"
        />
      </div>
      
      <!-- Rechte Teammitglieder -->
      <div class="team-right w-full md:w-1/4 lg:w-1/5 flex flex-row md:flex-col justify-around md:justify-start p-4">
        <TeamPortrait 
          v-for="member in team.slice(2, 4)" 
          :key="member.id" 
          :member="member" 
          @click="selectTeamMember(member)"
        />
      </div>
    </div>
    
    <NewsTicker :news="news" />
  </div>
</template>

<style>
.game-container {
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 100% 4px;
}

.team-left, .team-right {
  transition: all 0.3s ease;
}

.main-area {
  transition: all 0.3s ease;
}

/* Pixel art style for toast notifications */
.pixel-toast {
  font-family: 'Press Start 2P', monospace !important;
  font-size: 0.8rem !important;
  border: 3px solid theme('colors.crt.darkbrown') !important;
  border-radius: 4px !important;
  padding: 1rem !important;
  image-rendering: pixelated !important;
}

.success-toast {
  background-color: #90EE90 !important;
  color: #2F4F2F !important;
}

.error-toast {
  background-color: #8B0000 !important;
  color: #FFFFFF !important;
}

/* Override Vue-Toastification icon styles */
.Vue-Toastification__icon {
  width: 24px !important;
  height: 24px !important;
  image-rendering: pixelated !important;
}
</style>