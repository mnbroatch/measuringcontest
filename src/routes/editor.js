import React, { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import useSinglePlayerGame from "../hooks/use-single-player-game.js";
import GameEditor from "../components/game-staging/game-editor.js";
import PlayGame from "../components/play-game/play-game.js";
import GameStatus from "../components/game-status/game-status.js";

const SCREEN_STATE_EDITING = 'editing'
const SCREEN_STATE_TESTING = 'testing'

export default function Editor () {
  const [screenState, setScreenState] = useState(SCREEN_STATE_EDITING)
  const [savedGameRules, setSavedGameRules] = useState(null)
  const [savedGameName, setSavedGameName] = useState(null)
  const [savedNumPlayers, setSavedNumPlayers] = useState(null)
  const gameConnection = useSinglePlayerGame(savedGameRules, savedNumPlayers)

  return (
    <>
      {screenState === SCREEN_STATE_EDITING && (
        <GameEditor
          handleTestGame={({ gameRules, gameName, numPlayers }) => {
            setSavedGameRules(gameRules)
            setSavedGameName(gameName)
            setSavedNumPlayers(numPlayers)
            setScreenState(SCREEN_STATE_TESTING)
          }}
        />
      )}
      {gameConnection.state && screenState === SCREEN_STATE_TESTING && (
        <div className="testing-game">
          <div className="testing-game__title">
            Testing Game: {savedGameName}
            <button
              className="editor-buttons__button"
              onClick={() => { setScreenState(SCREEN_STATE_EDITING) }}
            >
              Back to Editor
            </button>
          </div>
          <PlayGame gameConnection={gameConnection} />
          <GameStatus gameConnection={gameConnection} />
        </div>
      )}
    </>
  )
}

export const Route = createFileRoute('/editor')({
  component: Editor
})
