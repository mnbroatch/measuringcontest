import React, { useState, useCallback, useEffect } from 'react'
import debounce from 'lodash/debounce'
import ticTacToe from "../../../server/tic-tac-toe.json";
import connectFour from "../../../server/connect-four.json";
// import reversi from "../../../server/reversi.json";

export default function GameEditor ({ initialGameName, initialGameRules, saveGame }) {
  const [gameRules, setGameRules] = useState(
    // initialGameRules || JSON.stringify(ticTacToe, null, 2)
    initialGameRules || JSON.stringify(connectFour, null, 2)
    // initialGameRules || JSON.stringify(reversi, null, 2)
  )
  const [gameName, setGameName] = useState(initialGameName)

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
      <div>
        <textarea
          onChange={(e) => {setGameRules(e.target.value)}}
          value={gameRules}
          style={{
            width: '80%',
            height: '50vh',
          }}
        >
        </textarea>

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
