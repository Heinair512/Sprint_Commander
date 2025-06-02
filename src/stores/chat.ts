import { defineStore } from "pinia";

interface ChatMessage {
  senderId: string;
  receiverId: string;
  content: string;
  eventId: string;
  timestamp: number;
}

interface ChatState {
  messagesByPair: Record<string, ChatMessage[]>;
  sharedHistory: ChatMessage[];
}

export const useChatStore = defineStore("chat", {
  state: (): ChatState => ({
    messagesByPair: {},
    sharedHistory: []
  }),
  
  getters: {
    getAllMessages(state): ChatMessage[] {
      return state.sharedHistory;
    },
    
    getEventHistory: (state) => (eventId: string) => {
      return state.sharedHistory.filter(msg => msg.eventId === eventId);
    }
  },
  
  actions: {
    addPrivateMessage(poId: string, memberId: string, content: string, eventId: string) {
      const message = {
        senderId: poId,
        receiverId: memberId,
        content,
        eventId,
        timestamp: Date.now()
      };
      
      // Add to pair history
      const pairKey = `${poId}-${memberId}`;
      if (!this.messagesByPair[pairKey]) {
        this.messagesByPair[pairKey] = [];
      }
      this.messagesByPair[pairKey].push(message);
      
      // Add to shared history
      this.sharedHistory.push(message);
    },
    
    addPrivateReply(memberId: string, poId: string, content: string, eventId: string) {
      const message = {
        senderId: memberId,
        receiverId: poId,
        content,
        eventId,
        timestamp: Date.now()
      };
      
      // Add to pair history
      const pairKey = `${poId}-${memberId}`;
      if (!this.messagesByPair[pairKey]) {
        this.messagesByPair[pairKey] = [];
      }
      this.messagesByPair[pairKey].push(message);
      
      // Add to shared history
      this.sharedHistory.push(message);
    }
  }
});