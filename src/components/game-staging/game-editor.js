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

export default function GameEditor ({ initialGameName, initialGameRules, saveGame }) {
  const [gameRules, setGameRules] = useState(initialGameRules || '')
  const [gameName, setGameName] = useState(initialGameName || '')

  const setGameMeta = useCallback(
    debounce((gName, gRules) => {
      saveGame({ gameName: gName, gameRules: gRules })
    }, 500),
    []
  );

  useEffect(() => {
    setGameMeta(gameName, gameRules);
    return () => {
      setGameMeta.cancel();
    };
  }, [setGameMeta, gameName, gameRules]);

  return (
    <div>
      {exampleGames.map(({name, rules}, i) => (
        <button
          key={i}
          onClick={() => {
            setGameRules(rules)
            setGameName(name)
          }}
        >
          {name}
        </button>
      ))}
      <div>
        <Editor
          height="400px"
          defaultLanguage="json"
          defaultValue={gameRules}
          onChange={setGameRules}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
        <div>
          <label>
            Game Name:
            <input
              onClick={(e) => {e.stopPropagation()}}
              onChange={(e) => {setGameName(e.target.value)}}
              value={gameName}
            >
            </input>
          </label>
        </div>
      </div>
    </div>
  )
}
