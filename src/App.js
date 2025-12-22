import React from 'react';
import './App.scss';
import SplitLayout from './components/SplitLayout';
import DocumentEditor from './components/DocumentEditor';
import ChatPanel from './components/ChatPanel';
import { useDocument } from './hooks/useDocument';
import { useChatKitSession } from './hooks/useChatKitSession';

function App() {
  const {
    documentText,
    documentTitle,
    language,
    taskType,
    wordCount,
    isUploading,
    setDocumentText,
    setDocumentTitle,
    setLanguage,
    setTaskType,
    handlePasteText,
    handleFileUpload
  } = useDocument();

  const { control } = useChatKitSession();

  return (
    <div className="app">
      <SplitLayout
        leftWidth={60}
        leftPanel={
          <DocumentEditor
            title={documentTitle}
            onTitleChange={setDocumentTitle}
            language={language}
            onLanguageChange={setLanguage}
            taskType={taskType}
            onTaskTypeChange={setTaskType}
            text={documentText}
            onTextChange={setDocumentText}
            wordCount={wordCount}
            onPasteText={handlePasteText}
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
          />
        }
        rightPanel={
          <ChatPanel control={control} />
        }
      />
    </div>
  );
}

export default App;

