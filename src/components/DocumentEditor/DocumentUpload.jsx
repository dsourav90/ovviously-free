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
          className="document-upload__btn" 
          onClick={onPasteText}
          aria-label="Paste text from clipboard"
        >
          📋 Paste text
        </button>
        <button 
          className="document-upload__btn"
          onClick={handleUploadClick}
          aria-label="Upload document"
        >
          ☁️ Upload document
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
