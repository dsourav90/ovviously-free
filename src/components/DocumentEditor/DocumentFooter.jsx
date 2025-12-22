import React from 'react';
import './DocumentFooter.scss';

const DocumentFooter = ({ wordCount }) => {
  return (
    <div className="document-footer">
      <div className="document-footer__word-count">
        {wordCount} {wordCount === 1 ? 'word' : 'words'}
      </div>
    </div>
  );
};

export default React.memo(DocumentFooter);
