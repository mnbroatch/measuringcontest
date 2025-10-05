import React from 'react'

export default function GamePreview ({ gameRules, gameName }) {
  return (
    <div>
      <h3>
        {gameName}
      </h3>
      <pre
        style={{
          width: '80%',
          height: '50vh',
        }}
      >
        {gameRules}
      </pre>
    </div>
  )
}
