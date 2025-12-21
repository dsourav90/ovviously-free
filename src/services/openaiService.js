// OpenAI Service
import OpenAI from 'openai';

class OpenAIService {
  constructor() {
    this.client = null;
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    this.threads = new Map(); // Store thread IDs for conversations
  }

  initialize() {
    if (!this.apiKey) {
      console.warn('OpenAI API key not found. Please set REACT_APP_OPENAI_API_KEY in your .env file');
      return false;
    }
    
    this.client = new OpenAI({
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true // Note: For production, use a backend proxy
    });
    
    return true;
  }

  // Fetch assistants from OpenAI account
  async listAssistants() {
    if (!this.client) {
      const initialized = this.initialize();
      if (!initialized) {
        throw new Error('OpenAI client not initialized. Please provide an API key.');
      }
    }

    try {
      const response = await this.client.beta.assistants.list({
        order: 'desc',
        limit: 100
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching assistants:', error);
      throw error;
    }
  }

  // Get a specific assistant by ID
  async getAssistant(assistantId) {
    if (!this.client) {
      const initialized = this.initialize();
      if (!initialized) {
        throw new Error('OpenAI client not initialized. Please provide an API key.');
      }
    }

    try {
      const assistant = await this.client.beta.assistants.retrieve(assistantId);
      return assistant;
    } catch (error) {
      console.error('Error fetching assistant:', error);
      throw error;
    }
  }

  // Send message using Assistant API
  async sendMessageToAssistant(assistantId, message, onStream = null) {
    if (!this.client) {
      const initialized = this.initialize();
      if (!initialized) {
        throw new Error('OpenAI client not initialized. Please provide an API key.');
      }
    }

    try {
      // Get or create thread for this conversation
      let threadId = this.threads.get(assistantId);
      
      if (!threadId) {
        const thread = await this.client.beta.threads.create();
        threadId = thread.id;
        this.threads.set(assistantId, threadId);
      }

      // Add message to thread
      await this.client.beta.threads.messages.create(threadId, {
        role: 'user',
        content: message
      });

      // Create and stream run
      const stream = await this.client.beta.threads.runs.stream(threadId, {
        assistant_id: assistantId
      });

      let fullResponse = '';

      for await (const event of stream) {
        if (event.event === 'thread.message.delta') {
          const delta = event.data.delta;
          if (delta.content && delta.content[0]?.text?.value) {
            const chunk = delta.content[0].text.value;
            fullResponse += chunk;
            if (onStream) {
              onStream(chunk, fullResponse);
            }
          }
        }
      }

      return fullResponse;
    } catch (error) {
      console.error('Error sending message to assistant:', error);
      throw error;
    }
  }

  // Clear thread for a fresh conversation
  clearThread(assistantId) {
    this.threads.delete(assistantId);
  }

  // Legacy method for chat completions (for non-assistant agents)
  async sendMessage(messages, agentConfig = {}) {
    if (!this.client) {
      const initialized = this.initialize();
      if (!initialized) {
        throw new Error('OpenAI client not initialized. Please provide an API key.');
      }
    }

    const {
      model = 'gpt-4',
      temperature = 0.7,
      maxTokens = 1000,
      systemPrompt = 'You are a helpful assistant.'
    } = agentConfig;

    try {
      const response = await this.client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature,
        max_tokens: maxTokens,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async streamMessage(messages, agentConfig = {}, onChunk) {
    if (!this.client) {
      const initialized = this.initialize();
      if (!initialized) {
        throw new Error('OpenAI client not initialized. Please provide an API key.');
      }
    }

    const {
      model = 'gpt-4',
      temperature = 0.7,
      maxTokens = 1000,
      systemPrompt = 'You are a helpful assistant.'
    } = agentConfig;

    try {
      const stream = await this.client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature,
        max_tokens: maxTokens,
        stream: true,
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
        if (onChunk) {
          onChunk(content, fullResponse);
        }
      }

      return fullResponse;
    } catch (error) {
      console.error('Error streaming message:', error);
      throw error;
    }
  }
}

const openaiServiceInstance = new OpenAIService();
export default openaiServiceInstance;
