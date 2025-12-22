import React from 'react';
import './DocumentHeader.scss';

const DocumentHeader = ({ 
  title, 
  onTitleChange, 
  language, 
  onLanguageChange, 
  taskType, 
  onTaskTypeChange 
}) => {
  const languageOptions = ['English (US)', 'English (UK)', 'Hindi'];
  const taskTypeOptions = ['Enter writing task', 'Legal Brief', 'Contract Draft', 'Legal Memo'];

  return (
    <div className="document-header">
      <input 
        type="text" 
        className="document-header__title" 
        placeholder="Untitled document"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        aria-label="Document title"
      />
      <div className="document-header__controls">
        <select 
          value={language} 
          onChange={(e) => onLanguageChange(e.target.value)}
          className="document-header__select"
          aria-label="Select language"
        >
          {languageOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <select 
          value={taskType} 
          onChange={(e) => onTaskTypeChange(e.target.value)}
          className="document-header__select"
          aria-label="Select task type"
        >
          {taskTypeOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default React.memo(DocumentHeader);
