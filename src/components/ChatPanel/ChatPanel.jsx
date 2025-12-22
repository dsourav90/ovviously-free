import React from 'react';
import { ChatKit } from '@openai/chatkit-react';
import './ChatPanel.scss';

const ChatPanel = ({ control, title = "AI Legal Assistant" }) => {
  return (
    <div className="chat-panel">
      <h1 className="chat-panel__title">{title}</h1>
      <div className="chat-panel__container">
        <ChatKit 
          control={control} 
          className="chat-panel__widget"
        />
      </div>
    </div>
  );
};

export default React.memo(ChatPanel);
