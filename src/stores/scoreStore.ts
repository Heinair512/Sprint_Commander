import { defineStore } from 'pinia';

interface TeamMemberScore {
  teamMorale: number;
  stakeholderSatisfaction: number;
}

interface ScoreState {
  scores: Record<string, TeamMemberScore>;
  outcome: number;
  burden: number;
}

export const useScoreStore = defineStore('score', {
  state: (): ScoreState => ({
    scores: {
      dev: { teamMorale: 0, stakeholderSatisfaction: 0 },
      ux: { teamMorale: 0, stakeholderSatisfaction: 0 },
      coach: { teamMorale: 0, stakeholderSatisfaction: 0 },
      stake: { teamMorale: 0, stakeholderSatisfaction: 0 }
    },
    outcome: 0, // Starting at 0 for initial state
    burden: 0  // Starting at 0 for initial state
  }),
  
  getters: {
    teamMorale: (state) => {
      const total = Object.values(state.scores).reduce((sum, score) => sum + score.teamMorale, 0);
      return Math.round(total / Object.keys(state.scores).length);
    },
    stakeholderSatisfaction: (state) => {
      const total = Object.values(state.scores).reduce((sum, score) => sum + score.stakeholderSatisfaction, 0);
      return Math.round(total / Object.keys(state.scores).length);
    },
    getMemberScore: (state) => (memberId: string) => state.scores[memberId] || { teamMorale: 0, stakeholderSatisfaction: 0 },
    getCurrentOutcome: (state) => state.outcome,
    getCurrentBurden: (state) => state.burden
  },
  
  actions: {
    updateMemberScore(memberId: string, teamMorale: number, stakeholderSatisfaction: number) {
      if (this.scores[memberId]) {
        this.scores[memberId].teamMorale = Math.max(-100, Math.min(100, teamMorale));
        this.scores[memberId].stakeholderSatisfaction = Math.max(-100, Math.min(100, stakeholderSatisfaction));
      }
    },
    updateOutcome(value: number) {
      this.outcome = Math.max(0, Math.min(100, this.outcome + value));
    },
    updateBurden(value: number) {
      this.burden = Math.max(0, Math.min(100, this.burden + value));
    },
    resetAllScores() {
      Object.keys(this.scores).forEach(memberId => {
        this.scores[memberId] = { teamMorale: 0, stakeholderSatisfaction: 0 };
      });
      this.outcome = 0;
      this.burden = 0;
    }
  }
});