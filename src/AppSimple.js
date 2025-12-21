import React, { useState, useEffect } from 'react';
import './App.scss';
import ChatContainer from './components/ChatContainer/ChatContainer';
import assistantService from './services/assistantService';

function App() {
  const [assistantInfo, setAssistantInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load assistant info on mount
    const loadAssistant = async () => {
      try {
        const info = await assistantService.getAssistantInfo();
        setAssistantInfo(info);
      } catch (err) {
        setError(err.message);
        console.error('Failed to load assistant:', err);
      }
    };

    loadAssistant();
  }, []);

  return (
    <div className="app">
      {error ? (
        <div className="error-container">
          <div className="error-content">
            <h1>Configuration Error</h1>
            <p>{error}</p>
            <div className="error-instructions">
              <h3>Setup Instructions:</h3>
              <ol>
                <li>Create a <code>.env</code> file in the root directory</li>
                <li>Add your OpenAI API key:<br/>
                  <code>REACT_APP_OPENAI_API_KEY=your_api_key</code>
                </li>
                <li>Add your Assistant ID:<br/>
                  <code>REACT_APP_ASSISTANT_ID=asst_xxxxx</code>
                </li>
                <li>Restart the development server</li>
              </ol>
            </div>
          </div>
        </div>
      ) : (
        <ChatContainer assistantInfo={assistantInfo} />
      )}
    </div>
  );
}

export default App;
