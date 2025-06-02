import { defineStore } from "pinia";

interface ChatMessage {
  senderId: string;
  content: string;
  eventId: string;
  timestamp: number;
}

interface ChatState {
  messagesByPair: Record<string, ChatMessage[]>;
}

export const useChatStore = defineStore("chat", {
  state: (): ChatState => ({
    messagesByPair: {}
  }),
  
  getters: {
    getAllMessages(state): ChatMessage[] {
      return Object.values(state.messagesByPair).flat();
    }
  },
  
  actions: {
    addPrivateMessage(poId: string, memberId: string, content: string, eventId: string) {
      const pairKey = `${poId}-${memberId}`;
      if (!this.messagesByPair[pairKey]) {
        this.messagesByPair[pairKey] = [];
      }
      this.messagesByPair[pairKey].push({
        senderId: poId,
        content,
        eventId,
        timestamp: Date.now()
      });
    },
    
    addPrivateReply(memberId: string, poId: string, content: string, eventId: string) {
      const pairKey = `${poId}-${memberId}`;
      if (!this.messagesByPair[pairKey]) {
        this.messagesByPair[pairKey] = [];
      }
      this.messagesByPair[pairKey].push({
        senderId: memberId,
        content,
        eventId,
        timestamp: Date.now()
      });
    }
  }
});