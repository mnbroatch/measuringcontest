import React, { useState } from 'react'
import { useCreateGameMutation } from "../../queries/use-create-game-mutation.js";
import ticTacToe from "../../../server/tic-tac-toe.json";

export default function ({ room, roomConnection, iAmRoomCreator }) {
  const [gameRules, setGameRules] = useState(JSON.stringify(ticTacToe, null, 2))
  const [gameName, setGameName] = useState('')
  const [name, setName] = useState('')
  const createGameMutation = useCreateGameMutation(room.data.roomCode)
  const players = roomConnection.state?.G?.players 

  return (
    <div>
      <button
        onClick={() => {
          roomConnection.client.moves.join(name)
        }}
      >
        Join Game as:
        <input
          onClick={(e) => {e.stopPropagation()}}
          onChange={(e) => {
            setName(e.target.value)}
          }
          value={name}
        >
        </input>
      </button>
      {iAmRoomCreator && !room.data.gameId && (
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
          </div>
          <button onClick={() => {
            createGameMutation.mutate({ gameRules, gameName, players })
          }}>
            Create Game with name:
            <input
              onClick={(e) => {e.stopPropagation()}}
              onChange={(e) => {setGameName(e.target.value)}}
              value={gameName}
            >
            </input>
          </button>
        </div>
      )}
    </div>
  )
}
