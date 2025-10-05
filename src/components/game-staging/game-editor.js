import React, { useState, useCallback, useEffect } from 'react'
import debounce from 'lodash/debounce'
import { useCreateGameMutation } from "../../queries/use-create-game-mutation.js";
import ticTacToe from "../../../server/tic-tac-toe.json";

export default function ({ room, roomConnection, iAmRoomCreator, iAmInGame }) {
  const createGameMutation = useCreateGameMutation(room.data.roomCode)
  const players = roomConnection.state?.G.players 
  const gameRules = roomConnection.state?.G.gameRules
    ? JSON.stringify(JSON.parse(roomConnection.state?.G?.gameRules), null, 2)
    : JSON.stringify(ticTacToe, null, 2)
  const gameName = roomConnection.state?.G.gameName 
  const name = roomConnection.state?.G.players[roomConnection.client?.playerID].name

  const [inputGameRules, setInputGameRules] = useState(gameRules)
  const [inputGameName, setGameName] = useState(gameName)
  const [inputName, setInputName] = useState(name)

  const setGameMeta = useCallback(
    debounce((gName, gRules) => {
      roomConnection.client.moves.setGameMeta({ gameName: gName, gameRules: gRules })
    }, 500),
    []
  );

  // Cleanup on unmount
  useEffect(() => {
    setGameMeta(inputGameName, inputGameRules);
    return () => {
      setGameMeta.cancel();
    };
  }, [setGameMeta, inputGameName, inputGameRules]);

  return (
    <div>
      <button
        onClick={() => {
          roomConnection.client.moves.join(inputName)
        }}
      >
        { iAmInGame ? 'Change name to:' : 'Join Game as:' }
        <input
          onClick={(e) => {e.stopPropagation()}}
          onChange={(e) => {
            setInputName(e.target.value)}
          }
          value={inputName}
        >
        </input>
      </button>
      <div>
        <h3>
          {gameName}
        </h3>
        <pre>
          {gameRules}
        </pre>
      </div>
      {iAmRoomCreator && !room.data.gameId && (
        <div>
          <div>
            <textarea
              onChange={(e) => {setInputGameRules(e.target.value)}}
              value={inputGameRules}
              style={{
                width: '80%',
                height: '50vh',
              }}
            >
            </textarea>
          </div>
          <button onClick={() => {
            createGameMutation.mutate({ gameRules: inputGameRules, gameName: inputGameName, players })
          }}>
            Create Game with name:
            <input
              onClick={(e) => {e.stopPropagation()}}
              onChange={(e) => {setGameName(e.target.value)}}
              value={inputGameName}
            >
            </input>
          </button>
        </div>
      )}
    </div>
  )
}
