import React, { useState } from 'react'
import Editor from '@monaco-editor/react';

export default function GamePreview ({ gameRules, roomCode }) {
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
        <div style={{ flex: 1, minHeight: 0 }}>
          <Editor
            height="100%"
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
      )}
      {!isOpen && (
        <div
          style={{ flex: 1 }}
          className="editor__input"
        >
          Have your friends log in and join with code: {roomCode}
        </div>
      )}
    </div>
  )
}
