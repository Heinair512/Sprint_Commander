import { createRouter, createWebHistory } from 'vue-router';
import GameView from '../views/GameView.vue';
import WorkspaceView from '../views/WorkspaceView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'game',
      component: GameView
    },
    {
      path: '/workspace',
      name: 'workspace',
      component: WorkspaceView
    }
  ]
});

export default router;