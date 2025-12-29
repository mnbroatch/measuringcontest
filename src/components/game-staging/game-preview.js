import React, { useState } from 'react'
import Editor from '@monaco-editor/react';

export default function GamePreview ({ gameRules }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="game-preview">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          className="button button--style-a button--small"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Hide' : 'Show'} Rules
        </button>
      </div>
      
      {isOpen && (
        <>
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
        </>
      )}
    </div>
  )
}
