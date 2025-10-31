import React from 'react'
import { useGame } from "../contexts/game-context.js";

export default function AbstractChoices () {
  const { clickTarget, allClickable } = useGame()

  const abstractChoices = [...allClickable].filter(c => c.abstract)

  return (
    <div className="personal-boards">
      {abstractChoices.map((choice, i) => (
        <button
          key={i}
          className="abstract-choice"
          onClick={() => clickTarget(choice)}
        >
          {choice.value}
        </button>
      ))}
    </div>
  )
}
