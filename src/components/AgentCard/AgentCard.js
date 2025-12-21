import React from 'react';
import './AgentCard.scss';

const AgentCard = ({ agent, isActive, onClick, onEdit, onDelete }) => {
  return (
    <div className={`agent-card ${isActive ? 'active' : ''}`} onClick={onClick}>
      <div className="agent-card-header">
        <span className="agent-icon">{agent.icon}</span>
        <div className="agent-info">
          <h3>
            {agent.name}
            {agent.isOpenAI && <span className="openai-badge">OpenAI</span>}
          </h3>
          <p>{agent.description}</p>
        </div>
      </div>
      
      <div className="agent-card-meta">
        <span className="meta-item">{agent.model}</span>
        <span className="meta-item">Temp: {agent.temperature}</span>
      </div>

      {!agent.isDefault && !agent.isOpenAI && (
        <div className="agent-card-actions" onClick={(e) => e.stopPropagation()}>
          <button 
            className="action-btn edit-btn" 
            onClick={() => onEdit(agent)}
            title="Edit agent"
          >
            ✏️
          </button>
          <button 
            className="action-btn delete-btn" 
            onClick={() => onDelete(agent.id)}
            title="Delete agent"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};

export default AgentCard;
