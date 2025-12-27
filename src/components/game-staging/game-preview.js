import React from 'react'
import Editor from '@monaco-editor/react';

export default function GamePreview ({ gameRules, gameName }) {
  return (
    <div className="game-preview">
      <h3>
        {gameName} - Rules
      </h3>
      <Editor
        className="editor__input"
        defaultLanguage="json"
        value={gameRules}
        theme="vs-dark"
        loading={null} 
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          readOnly: true
        }}
      />
    </div>
  )
}
