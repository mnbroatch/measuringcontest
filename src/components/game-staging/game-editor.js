import React, { useState, useCallback, useEffect } from 'react'
import debounce from 'lodash/debounce'
import ticTacToe from "../../../server/tic-tac-toe.json";
import eights from "../../../server/eights.json";
import eights2 from "../../../server/eights2.json";
import connectFour from "../../../server/connect-four.json";
import reversi from "../../../server/reversi.json";
import reversi2 from "../../../server/reversi2.json";
import checkers from "../../../server/checkers.json";
import Editor from '@monaco-editor/react';

const exampleGames = [
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
const NUM_PLAYERS_LOCALSTORAGE_KEY = 'bge-editor-num-players'

const gameRulesFromStorage = localStorage.getItem(RULES_LOCALSTORAGE_KEY)
const gameNameFromStorage = localStorage.getItem(NAME_LOCALSTORAGE_KEY)
const numPlayersFromStorage = +localStorage.getItem(NUM_PLAYERS_LOCALSTORAGE_KEY)

export default function GameEditor ({
  initialGameName,
  initialGameRules,
  initialNumPlayers,
  handleTestGame,
  handleCreateRoom,
  auth,
}) {
  const [gameRules, setGameRules] = useState(initialGameRules || gameRulesFromStorage || '')
  const [gameName, setGameName] = useState(initialGameName || gameNameFromStorage || '')
  const [numPlayers, setNumPlayers] = useState(initialNumPlayers || numPlayersFromStorage || 2)
  
  const handleGameRulesChange = (newGameRules) => {
    localStorage.setItem(RULES_LOCALSTORAGE_KEY, newGameRules)
    localStorage.setItem(NAME_LOCALSTORAGE_KEY, gameName)
    localStorage.setItem(NUM_PLAYERS_LOCALSTORAGE_KEY, numPlayers)
    setGameRules(newGameRules)
  }
  
  const handleGameNameChange = (newGameName) => {
    localStorage.setItem(RULES_LOCALSTORAGE_KEY, gameRules)
    localStorage.setItem(NAME_LOCALSTORAGE_KEY, newGameName)
    localStorage.setItem(NUM_PLAYERS_LOCALSTORAGE_KEY, numPlayers)
    setGameName(newGameName)
  }

  const handleNumPlayersChange = (newNumPlayers) => {
    localStorage.setItem(RULES_LOCALSTORAGE_KEY, gameRules)
    localStorage.setItem(NAME_LOCALSTORAGE_KEY, gameName)
    localStorage.setItem(NUM_PLAYERS_LOCALSTORAGE_KEY, newNumPlayers)
    setNumPlayers(+newNumPlayers)
  }
  
  const handleGameSelect = (e) => {
    const selectedIndex = e.target.value;
    if (selectedIndex !== "") {
      const selectedGame = exampleGames[selectedIndex];
      setGameRules(selectedGame.rules);
      setGameName(selectedGame.name);
    }
  };
  
  return (
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
            Select a legally distinct sample game...
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
        height="400px"
        className="editor__input"
        defaultLanguage="json"
        value={gameRules}
        onChange={handleGameRulesChange}
        theme="vs-dark"
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
        <div className="editor-num-players">
          <label>
            Number of Players:
            <input
              className="editor-num-players__input"
              onChange={(e) => {handleNumPlayersChange(e.target.value)}}
              value={numPlayers}
              type="number"
            />
          </label>
        </div>
        <div className="editor-buttons">
          <button
            className="editor-buttons__button"
            onClick={() => { handleTestGame({ gameName, gameRules, numPlayers }) }}
          >
            Test Game
          </button>
          {!auth.loading && !auth.idToken && (
            <button
              className="editor-buttons__button editor-buttons__button--login"
              onClick={auth.login}
            >
              Log in to Create Room
            </button>
          )}
          {!auth.loading && auth.idToken && (
            <button
              className="editor-buttons__button "
              onClick={() => { handleCreateRoom({ gameName, gameRules, numPlayers }) }}
            >
              Create Room
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
