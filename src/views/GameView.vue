<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useScoreStore } from '../stores/scoreStore';
import HeaderBar from '../components/HeaderBar.vue';
import TeamPortrait from '../components/TeamPortrait.vue';
import MainView from '../components/MainView.vue';
import NewsTicker from '../components/NewsTicker.vue';
import TeamChat from '../components/TeamChat.vue';
import ActionFeedback from '../components/ActionFeedback.vue';
import TipsPanel from '../components/TipsPanel.vue';
import KickoffScreen from '../components/KickoffScreen.vue';
import SuccessScreen from '../components/SuccessScreen.vue';
import teamData from '../data/team.json';
import events from '../data/events.json';
import news from '../data/news.json';
import levelsData from '../data/levels.json';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  portrait: string;
  quote: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  options: Array<{
    label: string;
    effect: number;
    outcome: number;
    burden: number;
    teamMorale: number;
    stakeholderMorale: number;
  }>;
}

interface Level {
  id: string;
  title: string;
  description: string;
  targetScore: number;
  minTeamMorale: number;
  minStakeholderSatisfaction: number;
  minOutcome: number;
  maxBurden: number;
  eventIds: string[];
}

const team = teamData.team as TeamMember[];
const levels = levelsData.levels as Level[];

const emit = defineEmits(['logout']);
const toast = useToast();
const score = ref(0);
const currentLevelIndex = ref(0);
const level = ref(levels[currentLevelIndex.value].title);
const missionTitle = ref(levels[currentLevelIndex.value].title);
const activeTeamMember = ref<TeamMember | null>(null);
const currentEventIndex = ref(0);
const currentEvent = ref(events[currentEventIndex.value] as Event);
const showChat = ref(false);
const showTeamChat = ref(false);
const showActionFeedback = ref(false);
const showTips = ref(false);
const showKickoff = ref(true);
const showMainGame = ref(false);
const showSuccessScreen = ref(false);
const scoreStore = useScoreStore();

// Computed properties for ActionFeedback component
const actionFeedbackMessage = computed(() => {
  switch (currentEvent.value.id) {
    case 'event-2':
      return 'Du hast ganz Achtsam die Ruhe bewahrt, was dir dein Team sehr dankt. Leider sind durch die Outage 5000 Bestellungen verloren gegangen, was deinem Unternehmen 5 Millionen Verlust eingebracht hat.';
    case 'event-1':
      return 'Das Team ist überfordert und die Qualität leidet. Mehrere kritische Bugs haben es in die Produktion geschafft.';
    default:
      return 'Das Team ist demotiviert und der Sprint ist gescheitert. Die Velocity ist auf einem Allzeittief.';
  }
});

const actionFeedbackTip = computed(() => {
  switch (currentEvent.value.id) {
    case 'event-2':
      return 'Es ist wichtig am Anfang schnell zu reagieren um die Kritikalität besser einschätzen zu können. Ruhig aber zügig.';
    case 'event-1':
      return 'Die Standard Antwort sollte \'Nein\' sein. Sonst verlierst du den Fokus und gehst das Risiko ein, am Ende gar nichts fertig zu haben.';
    default:
      return 'Vertraue den Daten und der Erfahrung des Teams.';
  }
});

const handleKickoffTransition = () => {
  showKickoff.value = false;
  showMainGame.value = true;
  currentEvent.value = events.find(e => e.id === 'event-1') as Event;
};

onMounted(() => {
  currentEvent.value = events.find(e => e.id === 'event-0') as Event;
  
  setTimeout(() => {
    const firstDecisionEvent = events.find(e => e.id === 'event-1');
    if (firstDecisionEvent) {
      currentEvent.value = firstDecisionEvent;
    }
  }, 20000);
});

const checkLevelCompletion = () => {
  const currentLevel = levels[currentLevelIndex.value];
  const teamMorale = scoreStore.teamMorale;
  const stakeholderSatisfaction = scoreStore.stakeholderSatisfaction;
  const outcome = scoreStore.getCurrentOutcome;
  const burden = scoreStore.getCurrentBurden;

  if (
    score.value >= currentLevel.targetScore &&
    teamMorale >= currentLevel.minTeamMorale &&
    stakeholderSatisfaction >= currentLevel.minStakeholderSatisfaction &&
    outcome >= currentLevel.minOutcome &&
    burden <= currentLevel.maxBurden
  ) {
    currentLevelIndex.value++;
    if (currentLevelIndex.value < levels.length) {
      level.value = levels[currentLevelIndex.value].title;
      missionTitle.value = levels[currentLevelIndex.value].title;
      toast.success(`Level geschafft! Willkommen in Level ${currentLevelIndex.value + 1}!`, {
        timeout: 5000
      });
      scoreStore.resetAllScores();
    } else {
      toast.success("Gratulation! Du hast alle Level gemeistert!", {
        timeout: 5000
      });
    }
  }
};

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

const handleShowTips = () => {
  showTips.value = true;
  showChat.value = false;
  showTeamChat.value = false;
  showActionFeedback.value = false;
};

const navigateEvent = (direction: 'prev' | 'next') => {
  if (direction === 'prev') {
    currentEventIndex.value = currentEventIndex.value > 0 ? currentEventIndex.value - 1 : events.length - 1;
  } else {
    currentEventIndex.value = currentEventIndex.value < events.length - 1 ? currentEventIndex.value + 1 : 0;
  }
  currentEvent.value = events[currentEventIndex.value] as Event;
  showTeamChat.value = false;
  showActionFeedback.value = false;
};

const makeDecision = (effect: number) => {
  const scoreElement = document.querySelector('.score');
  const selectedOption = currentEvent.value.options.find(opt => opt.effect === effect);
  
  if (!selectedOption) return;

  // Special case for team chat
  if (effect === -99) {
    showTeamChat.value = true;
    return;
  }

  // Update score
  score.value += selectedOption.effect;
  if (selectedOption.effect > 0) {
    scoreElement?.classList.add('success');
    setTimeout(() => scoreElement?.classList.remove('success'), 1000);
    
    // Show success screen for Event 1 when choosing the correct option
    if (currentEvent.value.id === 'event-1' && effect === 5) {
      showSuccessScreen.value = true;
    } else {
      showTeamChat.value = true;
    }
    
    toast.success(`Gute Entscheidung! -> ${selectedOption.effect > 0 ? '+' : ''}${selectedOption.effect} Punkte`, {
      timeout: 3000,
      toastClassName: "pixel-toast success-toast",
    });
  } else {
    scoreElement?.classList.add('error');
    setTimeout(() => scoreElement?.classList.remove('error'), 1000);
    showActionFeedback.value = true;
    toast.error(`Nicht optimal! ${selectedOption.effect} Punkte`, {
      timeout: 3000,
      toastClassName: "pixel-toast error-toast",
    });
  }

  // Update global metrics
  scoreStore.updateOutcome(selectedOption.outcome || 0);
  scoreStore.updateBurden(selectedOption.burden || 0);
  
  // Update team and stakeholder morale globally
  team.forEach(member => {
    scoreStore.updateMemberScore(
      member.id,
      selectedOption.teamMorale || 0,
      selectedOption.stakeholderMorale || 0
    );
  });

  checkLevelCompletion();
};

const selectTeamMember = (member: TeamMember) => {
  activeTeamMember.value = member;
  showChat.value = true;
  showTips.value = false;
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

const closeSuccessScreen = () => {
  showSuccessScreen.value = false;
};

watch(currentLevelIndex, (newIndex) => {
  const levelEvents = levels[newIndex].eventIds;
  const availableEvents = events.filter(event => levelEvents.includes(event.id));
  if (availableEvents.length > 0) {
    currentEventIndex.value = 0;
    currentEvent.value = availableEvents[0] as Event;
  }
});
</script>

<template>
  <div class="game-container bg-crt-bg min-h-screen flex flex-col">
    <HeaderBar 
      :missionTitle="missionTitle" 
      :score="score" 
      :level="level"
      @logout="handleLogout"
      @showTips="handleShowTips"
    />
    
    <div class="flex-grow flex flex-col lg:flex-row p-2 sm:p-4 gap-4">
      <template v-if="showKickoff">
        <div class="w-full">
          <KickoffScreen @transition="handleKickoffTransition" />
        </div>
      </template>
      
      <template v-else>
        <div class="team-left w-full lg:w-1/4 xl:w-1/5 grid grid-cols-2 lg:grid-cols-1 gap-4">
          <div v-for="member in team.slice(0, 2)" 
               :key="member.id"
               class="team-member-container transform hover:scale-105 transition-transform duration-200 cursor-pointer"
               @click="selectTeamMember(member)">
            <TeamPortrait :member="member" />
          </div>
        </div>
        
        <div class="main-area flex-grow lg:w-1/2 xl:w-3/5">
          <div class="max-w-4xl mx-auto h-full">
            <SuccessScreen 
              v-if="showSuccessScreen" 
              @close="closeSuccessScreen" 
            />
            <TipsPanel v-else-if="showTips" />
            <ActionFeedback
              v-else-if="showActionFeedback"
              :message="actionFeedbackMessage"
              :tip="actionFeedbackTip"
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
        </div>
        
        <div class="team-right w-full lg:w-1/4 xl:w-1/5 grid grid-cols-2 lg:grid-cols-1 gap-4">
          <div v-for="member in team.slice(2, 4)" 
               :key="member.id"
               class="team-member-container transform hover:scale-105 transition-transform duration-200 cursor-pointer"
               @click="selectTeamMember(member)">
            <TeamPortrait :member="member" />
          </div>
        </div>
      </template>
    </div>
    
    <NewsTicker :news="news" class="mt-auto" />
  </div>
</template>

<style>
.game-container {
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 100% 4px;
}

.team-member-container {
  @apply bg-crt-sepia/10 rounded-lg p-2;
}

@media (max-width: 1024px) {
  .team-member-container {
    @apply flex justify-center items-center;
  }
}

.team-left, .team-right, .main-area {
  transition: all 0.3s ease;
}

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

@media (max-width: 640px) {
  .pixel-toast {
    font-size: 0.7rem !important;
    padding: 0.75rem !important;
  }
}
</style>