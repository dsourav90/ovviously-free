import React from 'react';
import './App.scss';
import { ChatKit, useChatKit } from '@openai/chatkit-react';

function App() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
  
  const { control } = useChatKit({
    api: {
      async getClientSecret(existing) {
        if (existing) {
          return existing;
        }
        
        try {
          const res = await fetch(`${backendUrl}/api/chatkit/session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              deviceId: localStorage.getItem('deviceId') || `user-${Date.now()}`
            })
          });

          if (!res.ok) {
            throw new Error('Failed to get client secret');
          }

          const { client_secret } = await res.json();
          return client_secret;
        } catch (error) {
          console.error('Error getting client secret:', error);
          throw error;
        }
      }
    },
    composer: {
      attachments: {
        enabled: true
      }
    }
  });

  return (
    <div className="app">
      <div className="chat-wrapper">
        <h1 className="chat-title">AI Legal Assistant</h1>
        <div className="chatkit-container">
          <ChatKit 
            control={control} 
            className="chatkit-widget"
          />
        </div>
      </div>
    </div>
  );
}

export default App;

