import React from 'react'
import { useGame } from "../contexts/game-context.js";

export default function AbstractChoices () {
  const { clickTarget, allClickable, undoStep, currentMoveTargets } = useGame()

  const abstractChoices = [...allClickable].filter(c => c.abstract)

  return (
    <div className="abstract-choices">
      {!!currentMoveTargets.length && (
        <button
          className="abstract-choices__undo"
          onClick={undoStep}
        >
          Undo
        </button>
      )}
      {abstractChoices.map((choice, i) => (
        <button
          key={i}
          className="abstract-choices__choice"
          onClick={() => clickTarget(choice)}
        >
          {choice.value}
        </button>
      ))}
    </div>
  )
}
