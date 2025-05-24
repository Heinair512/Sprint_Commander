<script setup lang="ts">
import { ref, onMounted } from 'vue';
import HeaderBar from '../components/HeaderBar.vue';
import TeamPortrait from '../components/TeamPortrait.vue';
import MainView from '../components/MainView.vue';
import NewsTicker from '../components/NewsTicker.vue';
import team from '../data/team.json';
import events from '../data/events.json';
import news from '../data/news.json';

const score = ref(825);
const missionTitle = ref('Black Friday');
const level = ref('Jira Login');
const activeTeamMember = ref(null);
const currentEvent = ref(events[0]);
const showChat = ref(false);

const selectTeamMember = (member) => {
  activeTeamMember.value = member;
  showChat.value = true;
};

const closeChat = () => {
  showChat.value = false;
  activeTeamMember.value = null;
};

const makeDecision = (effect) => {
  score.value += effect;
  // Im echten Spiel würde hier das nächste Event geladen werden
  showChat.value = false;
};
</script>

<template>
  <div class="game-container bg-crt-bg min-h-screen flex flex-col">
    <HeaderBar :missionTitle="missionTitle" :score="score" :level="level" />
    
    <div class="flex-grow flex flex-col md:flex-row">
      <!-- Linke Teammitglieder - größerer Bereich -->
      <div class="team-left w-full md:w-1/4 lg:w-1/5 flex flex-row md:flex-col justify-around md:justify-start p-4">
        <TeamPortrait 
          v-for="member in team.slice(0, 2)" 
          :key="member.id" 
          :member="member" 
          @click="selectTeamMember(member)"
        />
      </div>
      
      <!-- Hauptbereich - jetzt etwas schmaler -->
      <div class="main-area flex-grow md:w-1/2 lg:w-3/5 p-4">
        <MainView 
          :currentEvent="currentEvent" 
          :showChat="showChat" 
          :activeTeamMember="activeTeamMember"
          @make-decision="makeDecision" 
          @close-chat="closeChat" 
        />
      </div>
      
      <!-- Rechte Teammitglieder - größerer Bereich -->
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

<style scoped>
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
</style>