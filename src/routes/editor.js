import React, { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import useSinglePlayerGame from "../hooks/use-single-player-game.js";
import GameEditor from "../components/game-staging/game-editor.js";
import PlayGame from "../components/play-game/play-game.js";
import GameStatus from "../components/game-status/game-status.js";

export default function Editor () {
  const [numPlayers, setNumPlayers] = useState(2)
  const [gameRules, setGameRules] = useState(null)
  const [savedGameRules, setSavedGameRules] = useState(null)
  const gameConnection = useSinglePlayerGame(savedGameRules, numPlayers)

  return (
    <>
      <GameEditor saveGame={({ gameRules }) => { setGameRules(gameRules) }} />
      <button
        onClick={() => { setSavedGameRules(gameRules) }}
      >
        Test Game with 
        <input
          onClick={(e) => {e.stopPropagation()}}
          onChange={(e) => {
            setNumPlayers(+e.target.value)}
          }
          value={numPlayers}
        >
        </input>
        players
      </button>
      {gameConnection.state && (
        <>
          <PlayGame gameConnection={gameConnection} />
          <GameStatus gameConnection={gameConnection} />
        </>
      )}
    </>
  )
}

export const Route = createFileRoute('/editor')({
  component: Editor
})
