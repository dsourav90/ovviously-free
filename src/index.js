import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import ChatOnly from './ChatOnly';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Check if we're in chat-only mode (for iframe embedding)
// Using URLSearchParams to properly parse query parameters
const urlParams = new URLSearchParams(window.location.search);
const isChatOnly = urlParams.get('view') === 'chat';

console.log('URL:', window.location.href);
console.log('isChatOnly:', isChatOnly);

root.render(
  <React.StrictMode>
    {isChatOnly ? <ChatOnly /> : <App />}
  </React.StrictMode>
);
