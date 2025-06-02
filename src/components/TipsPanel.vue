<script setup lang="ts">
import { ref } from 'vue';
import events from '../data/events.json';

interface Tip {
  id: string;
  title: string;
  resources: Array<{
    title: string;
    description: string;
    url: string;
    type: 'video' | 'article';
  }>;
}

const tips: Record<string, Tip> = {
  'event-1': {
    id: 'event-1',
    title: 'Production Outage',
    resources: [
      {
        title: 'Incident Response Playbook',
        description: 'Google SRE zeigt in diesem Talk, wie man ein Playbook für den akuten Ausfall aufsetzt – inklusive Kommunikationsstruktur und Rollen.',
        url: 'https://www.youtube.com/watch?v=RfnjNskapNg',
        type: 'video'
      },
      {
        title: '5 Whys-Root-Cause-Analyse',
        description: 'Nutze die 5 Whys-Analyse, um die wahren Ursachen eines Ausfalls zu identifizieren und nachhaltig zu beheben.',
        url: 'https://www.atlassian.com/blog/teamwork/5-whys-analysis',
        type: 'article'
      }
    ]
  },
  'event-2': {
    id: 'event-2',
    title: 'Feature Scope Creep',
    resources: [
      {
        title: 'MoSCoW-Priorisierung',
        description: 'Bevor neue Wünsche blind aufgenommen werden, hilft die MoSCoW-Priorisierung. Schau dir dieses Video an, um zu lernen, wie du Must-, Should-, Could- und Won\'t-Haves sauber trennst.',
        url: 'https://www.youtube.com/watch?v=XVx5FKZb6l4',
        type: 'video'
      },
      {
        title: 'Jobs-to-be-Done-Theorie',
        description: 'Um Wünsche wirklich aus Anwender-Jobs abzuleiten, lohnt ein Blick in die Jobs-to-be-Done-Theorie. Sehr praxisnah erklärt von Alan Klement.',
        url: 'https://www.youtube.com/watch?v=cdhra0UYILk',
        type: 'video'
      }
    ]
  },
  'event-3': {
    id: 'event-3',
    title: 'Sprint Planning',
    resources: [
      {
        title: 'Struktur & Effizienz',
        description: 'Ein klarer Sprint-Plan mit Zeitlimit verhindert endlose Diskussionen. Gute Best-Practices findest du in Atlassians Guide zum Sprint Planning.',
        url: 'https://www.atlassian.com/agile/scrum/sprint-planning',
        type: 'article'
      },
      {
        title: 'Moderation & Facilitation',
        description: 'Wie man ein effektives Kick-off für den Sprint plant und alle Beteiligten einbindet, zeigt dir dieses Video von Atlassian Jira Software.',
        url: 'https://www.youtube.com/watch?v=69z4KZ2faxE',
        type: 'video'
      }
    ]
  }
};

const selectedTip = ref<Tip | null>(null);

const selectTip = (eventId: string) => {
  selectedTip.value = tips[eventId];
};
</script>

<template>
  <div class="tips-panel bg-crt-sepia rounded-lg p-4 flex h-full">
    <!-- Tips Menu -->
    <div class="tips-menu w-1/3 border-r border-crt-darkbrown pr-4">
      <h2 class="text-lg text-crt-darkbrown mb-4">Tipps & Ressourcen</h2>
      <ul class="space-y-2">
        <li v-for="event in events" :key="event.id">
          <button
            @click="selectTip(event.id)"
            class="w-full text-left px-3 py-2 rounded transition-colors duration-200"
            :class="selectedTip?.id === event.id ? 'bg-crt-brown text-crt-lightsep' : 'hover:bg-crt-brown/20'"
          >
            {{ event.title }}
          </button>
        </li>
      </ul>
    </div>

    <!-- Tips Content -->
    <div class="tips-content flex-1 pl-4">
      <div v-if="selectedTip" class="h-full">
        <h2 class="text-lg text-crt-darkbrown mb-4">{{ selectedTip.title }}</h2>
        <div class="space-y-4">
          <div
            v-for="(resource, index) in selectedTip.resources"
            :key="index"
            class="resource-card bg-crt-lightsep p-4 rounded-lg"
          >
            <div class="flex items-start gap-3">
              <div class="resource-icon text-xl">
                {{ resource.type === 'video' ? '▶️' : '📄' }}
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-crt-darkbrown mb-2">{{ resource.title }}</h3>
                <p class="text-sm mb-3">{{ resource.description }}</p>
                <a
                  :href="resource.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-block text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  {{ resource.type === 'video' ? 'Video ansehen' : 'Artikel lesen' }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="h-full flex items-center justify-center text-crt-brown">
        <p>Wähle ein Event aus der Liste, um hilfreiche Tipps zu sehen.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tips-panel {
  font-family: 'Press Start 2P', monospace;
  font-size: 0.8rem;
}

.resource-card {
  transition: transform 0.2s ease;
}

.resource-card:hover {
  transform: translateY(-2px);
}
</style>