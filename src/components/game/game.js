import React from 'react'
import Entity from '../entity/entity.js'
import AbstractChoices from '../abstract-choices.js'

export default function Game ({ bgioState }) {
  const { G } = bgioState

  return (
    <>
      <div className="shared-board">
        {G.sharedBoard.entities.map((entity, i) => <Entity key={i} entity={entity} />)}
      </div>
      {G.personalBoards && (
        <div className="personal-boards">
          {G.personalBoards.map((board, i) => (
            <div key={i} className="personal-board">
              {board.entities.map((entity, j) => (
                <Entity key={j} entity={entity} />
              ))}
            </div>
          ))}
        </div>
      )}
      <AbstractChoices />
    </>
  )
}
