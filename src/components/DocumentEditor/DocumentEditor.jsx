import React from 'react';
import DocumentHeader from './DocumentHeader';
import DocumentUpload from './DocumentUpload';
import DocumentTextArea from './DocumentTextArea';
import DocumentFooter from './DocumentFooter';
import './DocumentEditor.scss';

const DocumentEditor = ({ 
  title,
  onTitleChange,
  language,
  onLanguageChange,
  taskType,
  onTaskTypeChange,
  text,
  onTextChange,
  wordCount,
  onPasteText,
  onFileUpload
}) => {
  return (
    <div className="document-editor">
      <DocumentHeader
        title={title}
        onTitleChange={onTitleChange}
        language={language}
        onLanguageChange={onLanguageChange}
        taskType={taskType}
        onTaskTypeChange={onTaskTypeChange}
      />
      <DocumentUpload
        onPasteText={onPasteText}
        onFileUpload={onFileUpload}
      />
      <DocumentTextArea
        value={text}
        onChange={onTextChange}
      />
      <DocumentFooter wordCount={wordCount} />
    </div>
  );
};

export default React.memo(DocumentEditor);
