import React from 'react';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="chat-footer">
      <div className="footer-content">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 12H16M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span>Powered by Chatbase</span>
      </div>
    </footer>
  );
};

export default Footer;
