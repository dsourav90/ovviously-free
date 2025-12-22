import React from 'react';
import './DocumentTextArea.scss';

const DocumentTextArea = ({ value, onChange, placeholder = "Start typing or paste your document here..." }) => {
  return (
    <div className="document-textarea">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="document-textarea__input"
        aria-label="Document content"
      />
    </div>
  );
};

export default React.memo(DocumentTextArea);
