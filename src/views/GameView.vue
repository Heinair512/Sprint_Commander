<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useScoreStore } from '../stores/scoreStore';
import HeaderBar from '../components/HeaderBar.vue';
import TeamPortrait from '../components/TeamPortrait.vue';
import MainView from '../components/MainView.vue';
import NewsTicker from '../components/NewsTicker.vue';
import TeamChat from '../components/TeamChat.vue';
import ActionFeedback from '../components/ActionFeedback.vue';
import TipsPanel from '../components/TipsPanel.vue';
import SuccessScreen from '../components/SuccessScreen.vue';
import KickoffScreen from '../components/KickoffScreen.vue';
import teamData from '../data/team.json';
import events from '../data/events.json';
import news from '../data/news.json';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  portrait: string;
}

const emit = defineEmits(['logout']);
const toast = useToast();
const score = ref(0);
const missionTitle = ref('Büro-Kaffee-App');
const level = ref('Level 1');
const activeTeamMember = ref<TeamMember | null>(null);
const currentEventIndex = ref(1);
const currentEvent = ref(events[currentEventIndex.value]);
const showChat = ref(false);
const showTeamChat = ref(false);
const showActionFeedback = ref(false);
const showTips = ref(false);
const showSuccess = ref(false);
const showKickoff = ref(false);
const scoreStore = useScoreStore();

const handleLogout = () => {
  emit('logout');
  toast.success('Erfolgreich ausgeloggt!', {
    timeout: 2000
  });
};

const handleShowTips = () => {
  showTips.value = true;
  showChat.value = false;
  showTeamChat.value = false;
  showActionFeedback.value = false;
  showSuccess.value = false;
  showKickoff.value = false;
};

const navigateEvent = (direction: 'prev' | 'next') => {
  if (direction === 'prev') {
    currentEventIndex.value = currentEventIndex.value > 1 ? currentEventIndex.value - 1 : events.length - 1;
  } else {
    currentEventIndex.value = currentEventIndex.value < events.length - 1 ? currentEventIndex.value + 1 : 1;
  }
  currentEvent.value = events[currentEventIndex.value];
  showTeamChat.value = false;
  showActionFeedback.value = false;
  showSuccess.value = false;
};

const updateMoods = (moodChanges: Record<string, { team: number; stakeholder: number }>) => {
  team.forEach(member => {
    const currentScore = scoreStore.getMemberScore(member.id);
    const changes = moodChanges[member.id];
    
    if (changes) {
      const randomFactor = 0.8 + Math.random() * 0.4;
      const adjustedTeamChange = Math.round(changes.team * randomFactor);
      const adjustedStakeChange = Math.round(changes.stakeholder * randomFactor);
      
      scoreStore.updateMemberScore(
        member.id,
        currentScore.teamMorale + adjustedTeamChange,
        currentScore.stakeholderSatisfaction + adjustedStakeChange
      );
    }
  });
};

const makeDecision = (effect: number) => {
  const scoreElement = document.querySelector('.score');
  
  if (currentEvent.value.id === 'event-1') {
    if (effect === -25) { // "Praktikant als Laufbursche" option
      score.value += 300;
      scoreElement?.classList.add('success');
      setTimeout(() => scoreElement?.classList.remove('success'), 1000);
      
      updateMoods({
        dev: { team: 20, stakeholder: -20 },
        ux: { team: 20, stakeholder: -20 },
        coach: { team: 20, stakeholder: -20 },
        stake: { team: -20, stakeholder: -20 }
      });
      
      scoreStore.updateOutcome(0);
      scoreStore.updateBurden(0);
      
      showSuccess.value = true;
      
      toast.success("Praktikant übernimmt! +300 Punkte", {
        timeout: 3000
      });
    } else if (effect === -50) { // "Alles einbauen, sofort!" option
      score.value -= 50;
      scoreElement?.classList.add('error');
      setTimeout(() => scoreElement?.classList.remove('error'), 1000);
      
      updateMoods({
        dev: { team: -30, stakeholder: 30 },
        ux: { team: -30, stakeholder: 30 },
        coach: { team: -30, stakeholder: 30 },
        stake: { team: 30, stakeholder: 30 }
      });
      
      scoreStore.updateOutcome(40);
      scoreStore.updateBurden(40);
      
      showActionFeedback.value = true;
      
      toast.error("Das Team ist überlastet! -50 Punkte", {
        timeout: 3000
      });
    } else { // "Mit dem Team sprechen" option
      score.value += 50;
      scoreElement?.classList.add('success');
      setTimeout(() => scoreElement?.classList.remove('success'), 1000);
      
      scoreStore.updateBurden(-5);
      showTeamChat.value = true;
      
      toast.success("Gute Wahl! Mit dem Team sprechen: +50 Punkte", {
        timeout: 3000
      });
    }
  } else {
    navigateEvent('next');
  }
};

const selectTeamMember = (member: TeamMember) => {
  activeTeamMember.value = member;
  showChat.value = true;
  showTips.value = false;
  showSuccess.value = false;
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

const closeSuccess = () => {
  showSuccess.value = false;
};

const handleNavigate = (screen: 'workspace' | 'game') => {
  if (screen === 'workspace') {
    showKickoff.value = true;
  } else {
    showKickoff.value = false;
  }
  showChat.value = false;
  showTeamChat.value = false;
  showActionFeedback.value = false;
  showTips.value = false;
  showSuccess.value = false;
};

const team = teamData.team;
</script>

<template>
  <div class="game-container bg-crt-bg min-h-screen flex flex-col">
    <HeaderBar 
      :missionTitle="missionTitle" 
      :score="score" 
      :level="level"
      @logout="handleLogout"
      @showTips="handleShowTips"
      @navigate="handleNavigate"
    />
    
    <div v-if="showKickoff">
      <KickoffScreen @transition="showKickoff = false" />
    </div>
    <div v-else class="flex-grow flex flex-col lg:flex-row p-2 sm:p-4 gap-4">
      <!-- Left team members -->
      <div class="team-left w-full lg:w-1/4 xl:w-1/5 grid grid-cols-2 lg:grid-cols-1 gap-4">
        <div v-for="member in team.slice(0, 2)" 
             :key="member.id"
             class="team-member-container transform hover:scale-105 transition-transform duration-200 cursor-pointer"
             @click="selectTeamMember(member)">
          <TeamPortrait :member="member" />
        </div>
      </div>
      
      <!-- Main area -->
      <div class="main-area flex-grow lg:w-1/2 xl:w-3/5">
        <div class="max-w-4xl mx-auto h-full">
          <TipsPanel v-if="showTips" />
          <SuccessScreen 
            v-else-if="showSuccess"
            @close="closeSuccess"
          />
          <ActionFeedback
            v-else-if="showActionFeedback"
            message="Bevor neue Wünsche blind aufgenommen werden, hilft die MoSCoW-Priorisierung. Schau dir dazu dieses Video an: https://www.youtube.com/watch?v=XVx5FKZb6l4"
            tip="Um Anforderungen wirklich aus Anwender-Jobs abzuleiten, lohnt ein Blick in die Jobs-to-be-Done-Theorie. Alan Klement erklärt es hier: https://www.youtube.com/watch?v=cdhra0UYILk"
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
      
      <!-- Right team members -->
      <div class="team-right w-full lg:w-1/4 xl:w-1/5 grid grid-cols-2 lg:grid-cols-1 gap-4">
        <div v-for="member in team.slice(2, 4)" 
             :key="member.id"
             class="team-member-container transform hover:scale-105 transition-transform duration-200 cursor-pointer"
             @click="selectTeamMember(member)">
          <TeamPortrait :member="member" />
        </div>
      </div>
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