import React from 'react'
import { useGame } from "../contexts/game-context.js";

export default function AbstractChoices () {
  const { dispatch, allClickable } = useGame()

  const abstractChoices = [...allClickable].filter(c => c.abstract)

  return (
    <div className="personal-boards">
      {abstractChoices.map((choice, i) => (
        <button
          key={i}
          className="abstract-choice"
          onClick={() => dispatch({ type: 'click', target: choice })}
        >
          {choice.value}
        </button>
      ))}
    </div>
  )
}
