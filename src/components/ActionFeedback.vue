<script setup lang="ts">
defineProps<{
  message: string;
  tip: string;
}>();

const emit = defineEmits(['close']);
</script>

<template>
  <div class="action-feedback bg-crt-sepia p-4 rounded-lg shadow-lg max-w-2xl mx-auto">
    <div class="feedback-header bg-crt-brown text-crt-glow p-3 flex items-center justify-between mb-4 rounded">
      <div class="text-lg">Feedback</div>
      <button @click="$emit('close')" class="close-btn px-2">X</button>
    </div>
    
    <div class="feedback-content bg-crt-lightsep p-6 rounded mb-4">
      <p class="mb-6 leading-relaxed">{{ message }}</p>
      
      <div class="tip-section border-t-4 border-crt-brown pt-4 mt-6">
        <div class="tip-header text-crt-brown mb-2 font-bold">Tipp für die Zukunft:</div>
        <p class="text-sm italic mb-4">{{ tip }}</p>
        
        <template v-if="message.includes('Feature')">
          <div class="additional-tips mt-6 space-y-6">
            <div class="tip-item">
              <h3 class="font-bold mb-2">MoSCoW-Priorisierung</h3>
              <p class="text-sm">
                Bevor neue Wünsche blind aufgenommen werden, hilft die MoSCoW-Priorisierung. Schau dir dieses Video an, um zu lernen, wie du Must-, Should-, Could- und Won't-Haves sauber trennst.
                <br>
                <a 
                  href="https://www.youtube.com/watch?v=XVx5FKZb6l4"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 hover:text-blue-800 underline"
                >
                  ▶️ MoSCoW Priorisierung Tutorial
                </a>
              </p>
            </div>
            
            <div class="tip-item">
              <h3 class="font-bold mb-2">Jobs-to-be-Done-Theorie</h3>
              <p class="text-sm">
                Um Wünsche wirklich aus Anwender-Jobs abzuleiten, lohnt ein Blick in die Jobs-to-be-Done-Theorie. Sehr praxisnah erklärt von Alan Klement.
                <br>
                <a 
                  href="https://www.youtube.com/watch?v=cdhra0UYILk"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 hover:text-blue-800 underline"
                >
                  ▶️ Jobs-to-be-Done Guide
                </a>
              </p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.action-feedback {
  font-family: 'Press Start 2P', monospace;
  font-size: 0.8rem;
}

.tip-section {
  background-color: rgba(92, 67, 33, 0.1);
  padding: 1rem;
  border-radius: 4px;
}

.tip-item {
  background-color: rgba(255, 255, 255, 0.5);
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid theme('colors.crt.brown');
}

a {
  font-family: inherit;
  transition: all 0.2s ease;
}

a:hover {
  opacity: 0.8;
}
</style>