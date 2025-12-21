import React, { useState } from 'react';
import './ImportAgents.scss';
import openaiService from '../../services/openaiService';
import agentStore from '../../services/agentStore';

const ImportAgents = ({ onClose, onImported }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assistants, setAssistants] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const handleFetchAssistants = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await openaiService.listAssistants();
      setAssistants(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleImport = async () => {
    if (selectedIds.size === 0) return;

    setLoading(true);
    try {
      const selected = assistants.filter(a => selectedIds.has(a.id));
      const imported = selected.map(assistant => ({
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
        isLocal: false
      }));

      imported.forEach(agent => {
        agentStore.addAgent(agent);
      });

      onImported(imported);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="import-agents">
      <div className="import-agents-header">
        <h2>Import OpenAI Assistants</h2>
        <button className="close-button" onClick={onClose}>✕</button>
      </div>

      <div className="import-agents-content">
        {assistants.length === 0 ? (
          <div className="empty-state">
            <p>Connect to your OpenAI account to import your existing assistants.</p>
            <button 
              className="btn-primary" 
              onClick={handleFetchAssistants}
              disabled={loading}
            >
              {loading ? 'Fetching...' : 'Fetch My Assistants'}
            </button>
          </div>
        ) : (
          <>
            <div className="assistants-list">
              {assistants.map(assistant => (
                <div 
                  key={assistant.id} 
                  className={`assistant-item ${selectedIds.has(assistant.id) ? 'selected' : ''}`}
                  onClick={() => toggleSelection(assistant.id)}
                >
                  <input 
                    type="checkbox" 
                    checked={selectedIds.has(assistant.id)}
                    onChange={() => {}}
                  />
                  <div className="assistant-info">
                    <h3>{assistant.name || 'Unnamed Assistant'}</h3>
                    <p className="assistant-model">{assistant.model}</p>
                    {assistant.description && (
                      <p className="assistant-description">{assistant.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="import-actions">
              <button className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleImport}
                disabled={loading || selectedIds.size === 0}
              >
                Import {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
              </button>
            </div>
          </>
        )}

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportAgents;
