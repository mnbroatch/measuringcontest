import React from 'react'
import Entity from '../entity/entity.js'

export default function Game ({ state }) {
  console.log('state', state)
  return (
    <>
      <div className="shared-board">
        {state.sharedBoard.map((entity, i) => <Entity key={i} entity={entity} />)}
      </div>
      <pre>
        {JSON.stringify(state.sharedBoard, null, 2)}
      </pre>
    </>
  )
}
