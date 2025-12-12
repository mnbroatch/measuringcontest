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

const gameRulesFromStorage = localStorage.getItem(RULES_LOCALSTORAGE_KEY)
const gameNameFromStorage = localStorage.getItem(NAME_LOCALSTORAGE_KEY)

export default function GameEditor ({ initialGameName, initialGameRules, saveGame }) {
  const [gameRules, setGameRules] = useState(initialGameRules || gameRulesFromStorage || '')
  const [gameName, setGameName] = useState(initialGameName || gameNameFromStorage || '')
  
  const setGameMeta = useCallback(
    debounce((gName, gRules) => {
      saveGame({ gameName: gName, gameRules: gRules })
    }, 500),
    []
  );

  const handleGameRulesChange = (gameRules) => {
    localStorage.setItem(RULES_LOCALSTORAGE_KEY, gameRules)
    localStorage.setItem(NAME_LOCALSTORAGE_KEY, gameName)
    setGameRules(gameRules)
  }
  
  const handleGameNameChange = (gameName) => {
    localStorage.setItem(RULES_LOCALSTORAGE_KEY, gameRules)
    localStorage.setItem(NAME_LOCALSTORAGE_KEY, gameName)
    setGameName(gameName)
  }
  
  useEffect(() => {
    setGameMeta(gameName, gameRules);
    return () => {
      setGameMeta.cancel();
    };
  }, [setGameMeta, gameName, gameRules]);
  
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
            Select a sample game
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
      <div>
        <Editor
          height="400px"
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
        <div className="editor-game-name">
          <label>
            Game Name:
            <input
              className="editor-game-name__input"
              onClick={(e) => {e.stopPropagation()}}
              onChange={(e) => {handleGameNameChange(e.target.value)}}
              value={gameName}
            />
          </label>
        </div>
      </div>
    </div>
  )
}
