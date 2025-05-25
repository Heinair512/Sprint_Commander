import { defineStore } from 'pinia';

export const useScoreStore = defineStore('score', {
  state: () => ({
    teamMorale: 0,
    stakeholderSatisfaction: 0
  }),
  
  actions: {
    updateTeamMorale(value: number) {
      this.teamMorale = value;
    },
    updateStakeholderSatisfaction(value: number) {
      this.stakeholderSatisfaction = value;
    }
  }
});