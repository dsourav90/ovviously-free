// Chatbase API Service
import axios from 'axios';

class ChatbaseService {
  constructor() {
    this.apiKey = process.env.REACT_APP_CHATBASE_API_KEY;
    this.chatbotId = process.env.REACT_APP_CHATBASE_CHATBOT_ID;
    this.baseUrl = 'https://www.chatbase.co/api/v1';
    this.conversationId = null;
  }

  initialize() {
    if (!this.apiKey) {
      throw new Error('Chatbase API key not found. Please set REACT_APP_CHATBASE_API_KEY in your .env file');
    }
    
    if (!this.chatbotId) {
      throw new Error('Chatbase Chatbot ID not found. Please set REACT_APP_CHATBASE_CHATBOT_ID in your .env file');
    }
    
    return true;
  }

  // Send message to Chatbase chatbot
  async sendMessage(message, onStream = null) {
    if (!this.apiKey || !this.chatbotId) {
      this.initialize();
    }

    try {
      const requestData = {
        chatbotId: this.chatbotId,
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        stream: !!onStream
      };

      // Add conversationId if exists to continue conversation
      if (this.conversationId) {
        requestData.conversationId = this.conversationId;
      }

      if (onStream) {
        // Streaming response
        const response = await fetch(`${this.baseUrl}/chat`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullResponse = parsed.text;
                  if (onStream) {
                    onStream(parsed.text, fullResponse);
                  }
                }
                if (parsed.conversationId) {
                  this.conversationId = parsed.conversationId;
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }

        return fullResponse;
      } else {
        // Non-streaming response
        const response = await axios.post(
          `${this.baseUrl}/chat`,
          requestData,
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.conversationId) {
          this.conversationId = response.data.conversationId;
        }

        return response.data.text;
      }
    } catch (error) {
      console.error('Error sending message to Chatbase:', error);
      throw error;
    }
  }

  // Clear conversation for new chat
  clearConversation() {
    this.conversationId = null;
  }

  // Get chatbot info
  async getChatbotInfo() {
    return {
      id: this.chatbotId,
      name: 'Chatbase Agent',
      description: 'Your Chatbase chatbot',
      provider: 'Chatbase'
    };
  }

  // Alias for backward compatibility
  async getAssistantInfo() {
    return this.getChatbotInfo();
  }

  // Not applicable for Chatbase, but keeping for compatibility
  async listAgents() {
    return [{
      id: this.chatbotId,
      name: 'Chatbase Agent',
      description: 'Your Chatbase chatbot',
      provider: 'Chatbase'
    }];
  }

  async getAgent(agentId) {
    return this.getChatbotInfo();
  }

  async createThread() {
    // Chatbase handles conversations automatically
    return true;
  }
}

const chatbaseService = new ChatbaseService();
export default chatbaseService;
