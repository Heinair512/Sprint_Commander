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
const scoreResetTimeout = ref<number | null>(null);

const handleLogout = () => {
  emit('logout');
  toast.success('Erfolgreich ausgeloggt!', {
    timeout: 2000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
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

const resetMoods = () => {
  scoreStore.resetAllScores();
};

const updateMoods = (moodChanges: Record<string, { team: number; stakeholder: number }>) => {
  // Update individual team member scores
  team.forEach(member => {
    const currentScore = scoreStore.getMemberScore(member.id);
    const changes = moodChanges[member.id];
    
    if (changes) {
      // Calculate individual variations (±20% random adjustment)
      const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
      const adjustedTeamChange = Math.round(changes.team * randomFactor);
      const adjustedStakeChange = Math.round(changes.stakeholder * randomFactor);
      
      scoreStore.updateMemberScore(
        member.id,
        currentScore.teamMorale + adjustedTeamChange,
        currentScore.stakeholderSatisfaction + adjustedStakeChange
      );
    }
  });

  // Clear any existing timeout
  if (scoreResetTimeout.value) {
    clearTimeout(scoreResetTimeout.value);
  }
  
  // Set new timeout to reset moods after 20 seconds
  scoreResetTimeout.value = window.setTimeout(() => {
    resetMoods();
  }, 20000);
};

const makeDecision = (effect: number) => {
  const scoreElement = document.querySelector('.score');
  
  switch(currentEvent.value.id) {
    case 'event-1': // Production Outage
      if (effect === 5) { // Team alarmieren
        score.value += 50;
        scoreElement?.classList.add('success');
        setTimeout(() => scoreElement?.classList.remove('success'), 1000);
        
        // Developer: Stressed but proud to help
        // UX: Concerned about user impact
        // Coach: Positive about quick response
        // Stakeholder: Happy about quick action
        updateMoods({
          dev: { team: -15, stakeholder: 20 },    // Stressed but doing important work
          ux: { team: -10, stakeholder: 15 },     // Worried about users but glad to help
          coach: { team: 5, stakeholder: 10 },    // Appreciates proactive response
          stake: { team: 15, stakeholder: 25 }    // Very happy about quick reaction
        });
        
        toast.success("Sehr gute Entscheidung, das sollten wir uns angucken -> +50 Punkte", {
          timeout: 3000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          className: "pixel-toast success-toast",
        });
        showTeamChat.value = true;
      } else { // Abwarten
        score.value -= 50;
        scoreElement?.classList.add('error');
        setTimeout(() => scoreElement?.classList.remove('error'), 1000);
        
        updateMoods({
          dev: { team: 5, stakeholder: -20 },     // Relaxed but knows it's wrong
          ux: { team: -5, stakeholder: -25 },     // Worried about user experience
          coach: { team: -15, stakeholder: -20 }, // Concerned about lack of action
          stake: { team: -25, stakeholder: -30 }  // Very unhappy about inaction
        });
        
        toast.error("Mutig, aber: dumm. -50 Punkte", {
          timeout: 3000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          className: "pixel-toast error-toast",
        });
        showActionFeedback.value = true;
      }
      break;
      
    case 'event-2': // Feature Scope Creep
      if (effect === 5) { // Zurück in die Refinement-Runde
        score.value += 50;
        scoreElement?.classList.add('success');
        setTimeout(() => scoreElement?.classList.remove('success'), 1000);
        
        updateMoods({
          dev: { team: 20, stakeholder: -5 },     // Happy about maintainable scope
          ux: { team: 15, stakeholder: -10 },     // Glad to focus on quality
          coach: { team: 25, stakeholder: 5 },    // Very happy about proper process
          stake: { team: -15, stakeholder: -20 }  // Unhappy about delay
        });
        
        toast.success("Kluge Entscheidung! Qualität vor Quantität -> +50 Punkte", {
          timeout: 3000,
          className: "pixel-toast success-toast",
        });
        showTeamChat.value = true;
      } else { // Alles reinnehmen
        score.value -= 50;
        scoreElement?.classList.add('error');
        setTimeout(() => scoreElement?.classList.remove('error'), 1000);
        
        updateMoods({
          dev: { team: -25, stakeholder: 5 },     // Very stressed about workload
          ux: { team: -20, stakeholder: -5 },     // Worried about quality
          coach: { team: -15, stakeholder: -10 }, // Concerned about team
          stake: { team: 20, stakeholder: 15 }    // Happy about features
        });
        
        toast.error("Oh je, das wird stressig! -50 Punkte", {
          timeout: 3000,
          className: "pixel-toast error-toast",
        });
        showActionFeedback.value = true;
      }
      break;
      
    case 'event-3': // Sprint Planning
      if (effect === 10) { // Velocity als Maßstab
        score.value += 50;
        scoreElement?.classList.add('success');
        setTimeout(() => scoreElement?.classList.remove('success'), 1000);
        
        updateMoods({
          dev: { team: 20, stakeholder: 10 },     // Happy about realistic planning
          ux: { team: 15, stakeholder: 5 },       // Appreciates achievable goals
          coach: { team: 25, stakeholder: 15 },   // Very happy about data-driven approach
          stake: { team: 5, stakeholder: -5 }     // Slightly concerned about pace
        });
        
        toast.success("Datenbasierte Entscheidung! Super! -> +50 Punkte", {
          timeout: 3000,
          className: "pixel-toast success-toast",
        });
        showTeamChat.value = true;
      } else { // Mehr Stories
        score.value -= 50;
        scoreElement?.classList.add('error');
        setTimeout(() => scoreElement?.classList.remove('error'), 1000);
        
        updateMoods({
          dev: { team: -25, stakeholder: -15 },   // Very unhappy about unrealistic goals
          ux: { team: -20, stakeholder: -10 },    // Worried about quality
          coach: { team: -25, stakeholder: -20 }, // Very concerned about team pressure
          stake: { team: 15, stakeholder: 10 }    // Happy about ambition
        });
        
        toast.error("Übermut tut selten gut! -50 Punkte", {
          timeout: 3000,
          className: "pixel-toast error-toast",
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
            ? 'Die Standard Antwort sollte "Nein" sein. Sonst verlierst du den Fokus und gehst das Risiko ein, am Ende gar nichts fertig zu haben.'
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
</style>