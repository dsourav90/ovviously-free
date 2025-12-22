import React, { useRef } from 'react';
import './DocumentUpload.scss';

const DocumentUpload = ({ onPasteText, onFileUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="document-upload">
      <p className="document-upload__prompt">Add text or upload doc</p>
      <div className="document-upload__buttons">
        <button 
          className="document-upload__btn document-upload__btn--paste" 
          onClick={onPasteText}
          aria-label="Paste text from clipboard"
        >
          <span className="document-upload__icon-wrapper">
            <svg className="document-upload__icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 16H5V5h2v3h10V5h2v14z"/>
            </svg>
          </span>
          Paste text
        </button>
        <button 
          className="document-upload__btn document-upload__btn--upload"
          onClick={handleUploadClick}
          aria-label="Upload document"
        >
          <span className="document-upload__icon-wrapper">
            <svg className="document-upload__icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15.01l1.41 1.41L11 14.84V19h2v-4.16l1.59 1.59L16 15.01 12.01 11z"/>
            </svg>
          </span>
          Upload document
        </button>
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".txt,.doc,.docx,.pdf" 
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default React.memo(DocumentUpload);
