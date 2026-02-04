import React, { useState, useRef } from 'react'
import Editor from '@monaco-editor/react';
import ticTacToe from "../../../server/tic-tac-toe.json";
import eights from "../../../server/eights.json";
import eights2 from "../../../server/eights2.json";
import connectFour from "../../../server/connect-four.json";
import reversi from "../../../server/reversi.json";
import reversi2 from "../../../server/reversi2.json";
import checkers from "../../../server/checkers.json";
import PlayGame from "../play-game/play-game.js";
import GameStatus from "../game-status/game-status.js";
import useSinglePlayerGame from "../../hooks/use-single-player-game.js";
import ButtonWithInput from '../../components/button-with-input/button-with-input.js'

const SCREEN_STATE_EDITING = 'editing'
const SCREEN_STATE_TESTING = 'testing'

const exampleGames = [
  {
    name: 'Blank',
    rules: '{}'
  },
  {
    name: 'Three in a Row',
    rules: JSON.stringify(ticTacToe, null, 2)
  },
  {
    name: 'Four in a Row but With Gravity',
    rules: JSON.stringify(connectFour, null, 2)
  },
  {
    name: 'Forth and Back White and Black',
    rules: JSON.stringify(reversi, null, 2)
  },
  {
    name: 'Discharged for Emotional Instability Eights',
    rules: JSON.stringify(eights, null, 2)
  },
  {
    name: 'Kingly Jumps',
    rules: JSON.stringify(checkers, null, 2)
  },
  {
    name: 'DEBUG Forth and Back White and Black',
    rules: JSON.stringify(reversi2, null, 2)
  },
  {
    name: 'DEBUG Discharged for Emotional Instability Eights',
    rules: JSON.stringify(eights2, null, 2)
  },
]

const RULES_LOCALSTORAGE_KEY = 'bge-editor-game-rules'
const NAME_LOCALSTORAGE_KEY = 'bge-editor-game-name'

export default function GameEditor ({
  initialGameName,
  initialGameRules,
  handleCreateRoom,
  goToRoom,
  roomCode,
  auth,
}) {
  const editorRef = useRef(null);
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  }
  const goToNextError = () => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'editor.action.marker.nextInFiles', null);
    }
  }

  const [screenState, setScreenState] = useState(SCREEN_STATE_EDITING)

  // controlled input state
  const [gameRules, setGameRules] = useState(() => 
    initialGameRules || localStorage.getItem(RULES_LOCALSTORAGE_KEY) || ''
  )
  const [gameName, setGameName] = useState(() =>
    initialGameName || localStorage.getItem(NAME_LOCALSTORAGE_KEY) || ''
  )

  // state that is frozen for testing (performance optimization so game connection
  // isn't re-established on every keystroke)
  const [savedGameRules, setSavedGameRules] = useState(null)
  const [savedNumPlayers, setSavedNumPlayers] = useState(null)

  const gameConnection = useSinglePlayerGame(savedGameRules, +savedNumPlayers)
  
  const handleGameRulesChange = (newGameRules) => {
    localStorage.setItem(RULES_LOCALSTORAGE_KEY, newGameRules)
    localStorage.setItem(NAME_LOCALSTORAGE_KEY, gameName)
    setGameRules(newGameRules)
  }
  
  const handleGameNameChange = (newGameName) => {
    localStorage.setItem(RULES_LOCALSTORAGE_KEY, gameRules)
    localStorage.setItem(NAME_LOCALSTORAGE_KEY, newGameName)
    setGameName(newGameName)
  }

  const handleGameSelect = (e) => {
    const selectedIndex = e.target.value;
    if (selectedIndex !== "") {
      const selectedGame = exampleGames[selectedIndex];
      setGameRules(selectedGame.rules);
      setGameName(selectedGame.name);
      localStorage.setItem(RULES_LOCALSTORAGE_KEY, selectedGame.rules)
      localStorage.setItem(NAME_LOCALSTORAGE_KEY, selectedGame.name)
    }
  };

  let gameRulesJSONIsValid = false
  try {
    JSON.parse(gameRules) 
    gameRulesJSONIsValid = true
  } catch {}

  return (
    <>
      {screenState === SCREEN_STATE_EDITING && (
        <>
          <div className="editor">
            <div className="sample-game-select">
              <select
                className="sample-game-select__inner"
                onChange={handleGameSelect}
                defaultValue=""
              >
                <option
                  value=""
                  className="sample-game-select__option"
                  disabled
                >
                  Select a legally distinct sample game
                </option>
                {exampleGames.map((game, i) => (
                  <option
                    key={i}
                    value={i}
                    className="sample-game-select__option"
                  >
                    {game.name}
                  </option>
                ))}
              </select>
            </div>
            <Editor
              className="editor__input"
              defaultLanguage="json"
              value={gameRules}
              onChange={handleGameRulesChange}
              theme="vs-dark"
              loading={null} 
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
            <div className="editor__controls">
              <div className="editor-game-name">
                <label>
                  Game Name:
                  <input
                    className="editor-game-name__input"
                    onChange={(e) => {handleGameNameChange(e.target.value)}}
                    value={gameName}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="buttons">
            {gameRulesJSONIsValid && (
              <ButtonWithInput
                className="join-room-button"
                label="Test Game With Player Count:"
                handleClick={(numPlayers) => {
                  setSavedGameRules(gameRules)
                  setSavedNumPlayers(numPlayers)
                  setScreenState(SCREEN_STATE_TESTING)
                }}
              />
            )}
            {!gameRulesJSONIsValid && (
              <button
                className="button button--x-small button--style-a button--disabled"
                onClick={goToNextError}
              >
                Invalid Game Rules
              </button>
            )}
            {!auth.loading && !auth.idToken && (
              <button
                className="button button--x-small button--style-b"
                onClick={auth.login}
              >
                Log in to Create Room
              </button>
            )}
            {!auth.loading && auth.idToken && !roomCode && (
              <button
                className="button button--x-small button--style-a"
                onClick={() => { handleCreateRoom({ gameName, gameRules }) }}
              >
                Create Room
              </button>
            )}
            {!auth.loading && auth.idToken && roomCode && (
              <button
                className="button button--x-small button--style-a"
                onClick={() => goToRoom({ gameName, gameRules })}
              >
                Go To Room
              </button>
            )}
          </div>
    </>
      )}
      {gameConnection.state && screenState === SCREEN_STATE_TESTING && (
        <div className="testing-game">
          <div className="testing-game__title">
            <h6 className="testing-game__title__tip">
              Tip: Click the gear -> to choose a player's view to see
            </h6>
            <h4 className="testing-game__title__text">
              Testing Game: {gameName}
            </h4>
            <button
              className="button button--x-small button--style-a"
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
