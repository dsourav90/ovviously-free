import React, { useState, useEffect } from 'react';
import './AgentSelector.scss';
import assistantService from '../../services/assistantService';

const AgentSelector = ({ onAgentSelect, selectedAgent }) => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    loadAgents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      const agentList = await assistantService.listAgents();
      setAgents(agentList);
      
      // Auto-select first agent if none selected
      if (agentList.length > 0 && !selectedAgent) {
        onAgentSelect(agentList[0]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to load agents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAgentClick = (agent) => {
    onAgentSelect(agent);
    setShowSelector(false);
  };

  return (
    <div className="agent-selector">
      <button 
        className="agent-selector-trigger"
        onClick={() => setShowSelector(!showSelector)}
      >
        <div className="trigger-content">
          <span className="agent-icon">🤖</span>
          <div className="agent-details">
            <span className="agent-name">
              {selectedAgent?.name || 'Select Agent'}
            </span>
            {selectedAgent && (
              <span className="agent-model">{selectedAgent.model}</span>
            )}
          </div>
        </div>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={`chevron ${showSelector ? 'open' : ''}`}
        >
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {showSelector && (
        <>
          <div className="selector-overlay" onClick={() => setShowSelector(false)} />
          <div className="agent-dropdown">
            <div className="dropdown-header">
              <h3>Your Agents from Agent Builder</h3>
              <button onClick={loadAgents} disabled={loading} className="refresh-btn">
                ↻
              </button>
            </div>

            {loading && <div className="loading">Loading agents...</div>}
            
            {error && (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={loadAgents} className="retry-btn">Retry</button>
              </div>
            )}

            {!loading && !error && agents.length === 0 && (
              <div className="empty-state">
                <p>No agents found.</p>
                <a 
                  href="https://platform.openai.com/agent-builder" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="create-agent-link"
                >
                  Create an agent →
                </a>
              </div>
            )}

            {!loading && !error && agents.length > 0 && (
              <div className="agents-list">
                {agents.map(agent => (
                  <div
                    key={agent.id}
                    className={`agent-item ${selectedAgent?.id === agent.id ? 'active' : ''}`}
                    onClick={() => handleAgentClick(agent)}
                  >
                    <div className="agent-item-icon">🤖</div>
                    <div className="agent-item-info">
                      <h4>{agent.name}</h4>
                      <p>{agent.description}</p>
                      <span className="agent-item-model">{agent.model}</span>
                    </div>
                    {selectedAgent?.id === agent.id && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="check-icon">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="dropdown-footer">
              <a 
                href="https://platform.openai.com/agent-builder" 
                target="_blank" 
                rel="noopener noreferrer"
                className="manage-link"
              >
                Manage agents in Agent Builder →
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AgentSelector;
