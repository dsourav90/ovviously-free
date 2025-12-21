import React from 'react';
import './ChatMessage.scss';

const ChatMessage = ({ message, isUser }) => {
  return (
    <div className={`chat-message ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-avatar">
        {isUser ? '👤' : '🤖'}
      </div>
      <div className="message-content">
        <div className="message-text">{message}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
