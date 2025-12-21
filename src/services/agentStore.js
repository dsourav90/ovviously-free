// Agent Configuration Store
export const DEFAULT_AGENTS = [
  {
    id: 'general-assistant',
    name: 'General Assistant',
    description: 'A helpful general-purpose AI assistant',
    systemPrompt: 'You are a helpful, creative, and friendly AI assistant. Provide clear and concise responses.',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1000,
    icon: '🤖'
  },
  {
    id: 'code-expert',
    name: 'Code Expert',
    description: 'Specialized in programming and software development',
    systemPrompt: 'You are an expert software developer. Provide detailed code examples, explanations, and best practices. Format code properly with markdown.',
    model: 'gpt-4',
    temperature: 0.5,
    maxTokens: 2000,
    icon: '💻'
  },
  {
    id: 'creative-writer',
    name: 'Creative Writer',
    description: 'Helps with creative writing and content generation',
    systemPrompt: 'You are a creative writer with a flair for storytelling. Help users craft engaging narratives, blog posts, and creative content.',
    model: 'gpt-4',
    temperature: 0.9,
    maxTokens: 1500,
    icon: '✍️'
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Analyzes data and provides insights',
    systemPrompt: 'You are a data analyst expert. Help users understand data, perform analysis, and provide actionable insights.',
    model: 'gpt-4',
    temperature: 0.3,
    maxTokens: 1500,
    icon: '📊'
  }
];

class AgentStore {
  constructor() {
    this.agents = this.loadAgents();
  }

  loadAgents() {
    const stored = localStorage.getItem('chatbase_agents');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error loading agents:', e);
      }
    }
    return [...DEFAULT_AGENTS];
  }

  saveAgents() {
    localStorage.setItem('chatbase_agents', JSON.stringify(this.agents));
  }

  getAllAgents() {
    return this.agents;
  }

  getAgent(id) {
    return this.agents.find(agent => agent.id === id);
  }

  addAgent(agent) {
    const newAgent = {
      ...agent,
      id: agent.id || `agent-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isLocal: !agent.assistantId // Mark if it's a local or OpenAI assistant
    };
    this.agents.push(newAgent);
    this.saveAgents();
    return newAgent;
  }

  // Import agents from OpenAI
  async importFromOpenAI(openaiService) {
    try {
      const assistants = await openaiService.listAssistants();
      const importedAgents = assistants.map(assistant => ({
        id: `openai-${assistant.id}`,
        assistantId: assistant.id,
        name: assistant.name || 'Unnamed Assistant',
        description: assistant.description || assistant.instructions?.substring(0, 100) || 'OpenAI Assistant',
        systemPrompt: assistant.instructions || '',
        model: assistant.model || 'gpt-4',
        temperature: 0.7,
        maxTokens: 1000,
        icon: '🤖',
        isOpenAI: true,
        isLocal: false,
        metadata: assistant.metadata || {}
      }));

      // Add new assistants that aren't already imported
      importedAgents.forEach(agent => {
        const exists = this.agents.find(a => a.assistantId === agent.assistantId);
        if (!exists) {
          this.agents.push(agent);
        }
      });

      this.saveAgents();
      return importedAgents;
    } catch (error) {
      console.error('Error importing agents from OpenAI:', error);
      throw error;
    }
  }

  updateAgent(id, updates) {
    const index = this.agents.findIndex(agent => agent.id === id);
    if (index !== -1) {
      this.agents[index] = { ...this.agents[index], ...updates };
      this.saveAgents();
      return this.agents[index];
    }
    return null;
  }

  deleteAgent(id) {
    const index = this.agents.findIndex(agent => agent.id === id);
    if (index !== -1) {
      this.agents.splice(index, 1);
      this.saveAgents();
      return true;
    }
    return false;
  }

  resetToDefaults() {
    this.agents = [...DEFAULT_AGENTS];
    this.saveAgents();
    return this.agents;
  }
}

const agentStoreInstance = new AgentStore();
export default agentStoreInstance;
