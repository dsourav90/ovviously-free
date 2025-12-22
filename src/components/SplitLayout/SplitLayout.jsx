import React from 'react';
import './SplitLayout.scss';

const SplitLayout = ({ leftPanel, rightPanel, leftWidth = 60 }) => {
  return (
    <div className="split-layout">
      <div 
        className="split-layout__left" 
        style={{ width: `${leftWidth}%` }}
      >
        {leftPanel}
      </div>
      <div 
        className="split-layout__right" 
        style={{ width: `${100 - leftWidth}%` }}
      >
        {rightPanel}
      </div>
    </div>
  );
};

export default React.memo(SplitLayout);
