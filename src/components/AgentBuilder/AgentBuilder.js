import React, { useState } from 'react';
import './AgentBuilder.scss';

const AgentBuilder = ({ onSave, onCancel, editAgent = null }) => {
  const [agentData, setAgentData] = useState(editAgent || {
    name: '',
    description: '',
    systemPrompt: '',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1000,
    icon: '🤖'
  });

  const [errors, setErrors] = useState({});

  const models = [
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
  ];

  const icons = ['🤖', '💻', '✍️', '📊', '🎨', '🔬', '📚', '🎓', '💡', '🚀'];

  const validate = () => {
    const newErrors = {};
    if (!agentData.name.trim()) newErrors.name = 'Name is required';
    if (!agentData.systemPrompt.trim()) newErrors.systemPrompt = 'System prompt is required';
    if (agentData.temperature < 0 || agentData.temperature > 2) {
      newErrors.temperature = 'Temperature must be between 0 and 2';
    }
    if (agentData.maxTokens < 1 || agentData.maxTokens > 4000) {
      newErrors.maxTokens = 'Max tokens must be between 1 and 4000';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(agentData);
    }
  };

  const handleChange = (field, value) => {
    setAgentData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="agent-builder">
      <div className="agent-builder-header">
        <h2>{editAgent ? 'Edit Agent' : 'Create New Agent'}</h2>
        <button className="close-button" onClick={onCancel}>✕</button>
      </div>

      <form className="agent-builder-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="agent-icon">Icon</label>
          <div className="icon-selector">
            {icons.map(icon => (
              <button
                key={icon}
                type="button"
                className={`icon-option ${agentData.icon === icon ? 'selected' : ''}`}
                onClick={() => handleChange('icon', icon)}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="agent-name">Name *</label>
          <input
            id="agent-name"
            type="text"
            value={agentData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Marketing Expert"
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="agent-description">Description</label>
          <input
            id="agent-description"
            type="text"
            value={agentData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Brief description of the agent's purpose"
          />
        </div>

        <div className="form-group">
          <label htmlFor="agent-system-prompt">System Prompt *</label>
          <textarea
            id="agent-system-prompt"
            value={agentData.systemPrompt}
            onChange={(e) => handleChange('systemPrompt', e.target.value)}
            placeholder="Define the agent's personality, expertise, and behavior..."
            rows={4}
            className={errors.systemPrompt ? 'error' : ''}
          />
          {errors.systemPrompt && <span className="error-message">{errors.systemPrompt}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="agent-model">Model</label>
            <select
              id="agent-model"
              value={agentData.model}
              onChange={(e) => handleChange('model', e.target.value)}
            >
              {models.map(model => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="agent-temperature">
              Temperature: {agentData.temperature}
            </label>
            <input
              id="agent-temperature"
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={agentData.temperature}
              onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
            />
            <small>Lower = more focused, Higher = more creative</small>
            {errors.temperature && <span className="error-message">{errors.temperature}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="agent-max-tokens">Max Tokens: {agentData.maxTokens}</label>
          <input
            id="agent-max-tokens"
            type="range"
            min="100"
            max="4000"
            step="100"
            value={agentData.maxTokens}
            onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
          />
          <small>Maximum length of the response</small>
          {errors.maxTokens && <span className="error-message">{errors.maxTokens}</span>}
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {editAgent ? 'Update Agent' : 'Create Agent'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgentBuilder;
