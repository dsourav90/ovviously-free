import React, { useState, useEffect } from 'react';
import './Sidebar.scss';
import NewChatButton from '../NewChatButton/NewChatButton';
import AgentCard from '../AgentCard/AgentCard';
import agentStore from '../../services/agentStore';

const Sidebar = ({ activeAgent, onAgentSelect, onNewAgent, onImportAgents }) => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = () => {
    setAgents(agentStore.getAllAgents());
  };

  const handleEdit = (agent) => {
    onNewAgent(agent);
  };

  const handleDelete = (agentId) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      agentStore.deleteAgent(agentId);
      loadAgents();
      if (activeAgent?.id === agentId) {
        onAgentSelect(agents[0]);
      }
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-toggle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <div className="sidebar-content">
        <NewChatButton />
        
        <div className="agents-section">
          <div className="agents-header">
            <h3>Agents</h3>
            <div className="agents-actions">
              <button 
                className="import-agents-btn" 
                onClick={onImportAgents} 
                title="Import from OpenAI"
              >
                ↓
              </button>
              <button className="add-agent-btn" onClick={() => onNewAgent()} title="Create new agent">
                +
              </button>
            </div>
          </div>
          <div className="agents-list">
            {agents.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isActive={activeAgent?.id === agent.id}
                onClick={() => onAgentSelect(agent)}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
