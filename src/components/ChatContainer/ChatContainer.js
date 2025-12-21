import React, { useState, useRef, useEffect } from 'react';
import './ChatContainer.scss';
import Logo from '../Logo/Logo';
import ChatInput from '../ChatInput/ChatInput';
import ChatMessage from '../ChatMessage/ChatMessage';
import Footer from '../Footer/Footer';
import assistantService from '../../services/assistantService';

const ChatContainer = ({ assistantInfo, selectedAgent }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Clear messages when agent changes
    if (selectedAgent) {
      setMessages([]);
      assistantService.clearConversation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAgent?.id]);

  const handleSendMessage = async (message) => {
    if (!message.trim() || isLoading) return;

    if (!selectedAgent) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Please select an agent from the dropdown above to start chatting.'
      }]);
      return;
    }

    // Add user message
    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Add placeholder for assistant response
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      await assistantService.sendMessage(
        selectedAgent.id,
        message,
        (chunk, fullText) => {
          // Update the streaming response
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { 
              role: 'assistant', 
              content: fullText 
            };
            return newMessages;
          });
        }
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: error.message.includes('API key')
            ? 'Please configure your OpenAI API key in the .env file.'
            : 'Sorry, I encountered an error. Please try again.'
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    assistantService.clearConversation();
  };

  return (
    <main className="chat-container">
      <div className="chat-header">
        {assistantInfo && (
          <div className="assistant-info-header">
            <div className="assistant-details">
              <h2>{assistantInfo.name}</h2>
              <p>{assistantInfo.description}</p>
            </div>
            <button className="new-chat-header-btn" onClick={handleNewChat} title="Start new conversation">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              New Chat
            </button>
          </div>
        )}
      </div>

      <div className="chat-content">
        {messages.length === 0 ? (
          <div className="chat-welcome">
            <Logo />
            <h1 className="chat-title">How can I help you today?</h1>
            {assistantInfo && (
              <div className="active-agent-info">
                <h2>{assistantInfo.name}</h2>
                <p>{assistantInfo.description}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                message={msg.content}
                isUser={msg.role === 'user'}
              />
            ))}
            {isLoading && messages[messages.length - 1]?.content === '' && (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
        <div className="chat-input-wrapper">
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default ChatContainer;
