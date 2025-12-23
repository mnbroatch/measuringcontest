import React from 'react'
import Editor from '@monaco-editor/react';

export default function GamePreview ({ gameRules, gameName }) {
  return (
    <div className="game-preview">
      <h3>
        {gameName} - Rules
      </h3>
      <Editor
        height="80%"
        className="editor__input"
        defaultLanguage="json"
        value={gameRules}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          readOnly: true
        }}
      />
    </div>
  )
}
