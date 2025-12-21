import React from 'react';
import './NewChatButton.scss';

const NewChatButton = () => {
  const handleNewChat = () => {
    console.log('New chat clicked');
  };

  return (
    <button className="new-chat-button" onClick={handleNewChat}>
      <svg className="new-chat-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="new-chat-text">New chat</span>
    </button>
  );
};

export default NewChatButton;
