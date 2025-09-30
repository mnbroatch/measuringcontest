import React, { useState } from 'react'
import get from 'lodash/get.js'
import { serialize } from 'wackson'
import { createFileRoute } from "@tanstack/react-router"
import { useRoomQuery } from "../queries/use-room-query.js";
import { useJoinRoomMutation } from "../queries/use-join-room-mutation.js";
import { useLeaveRoomMutation } from "../queries/use-leave-room-mutation.js";
import { useCreateGameMutation } from "../queries/use-create-game-mutation.js";
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import useGame from "../hooks/use-game.js";
import ticTacToe from "../../server/tic-tac-toe.json";
import conditionFactory from '../game-factory/condition/condition-factory.js'

export default function RoomPage () {
  const { roomcode: roomCode } = Route.useParams()
  const [gameRules, setGameRules] = useState(JSON.stringify(ticTacToe, null, 2))
  const { userId } = useCognitoAuth()
  const room = useRoomQuery(roomCode)
  const joinRoomMutation = useJoinRoomMutation(roomCode)
  const leaveRoomMutation = useLeaveRoomMutation(roomCode)
  const createGameMutation = useCreateGameMutation(roomCode)
  const { G, moves, client } = useGame()

  return !room.isLoading && (
    <>
      {!room.data.members?.includes(userId) && (
        <button onClick={joinRoomMutation.mutate}>
          Join
        </button>
      )}
      <textarea onChange={(e) => {setGameRules(e.target.value)}} value={gameRules}></textarea>
      {userId && room.data.createdBy === userId && (
        <button onClick={() => { createGameMutation.mutate(gameRules) }}>
          Create Game
        </button>
      )}
      {room.data.members?.includes(userId) && (
        <button onClick={leaveRoomMutation.mutate}>
          Leave
        </button>
      )}
      {G && (
        <pre>
          {JSON.stringify(G.sharedBoard, null, 2)}
        </pre>
      )}
      {G && G.sharedBoard[0].spaces.map((space, i) =>  (
        <button key={i} onClick={() => { moves?.placePlayerMarker(makePayload(G, i)) }}>
          Do {i}
        </button>
      ))}
      {G && (
        <button onClick={() => { client?.events.endTurn() }}>
          end turn
        </button>
      )}
      {G && (
        <button onClick={() => { client?.events.endTurn({ next: '0'}) }}>
          end turn +
        </button>
      )}
      {G && (
        <button onClick={() => { client?.events.endTurn({ next: '1'}) }}>
          end turn ++
        </button>
      )}
    </>
  )
}

function makePayload (G, n) {
  return { entities: { destination: G.sharedBoard[0].spaces[n] } }
}

export const Route = createFileRoute("/rooms/$roomcode")({
  loader: ({ params }) => useRoomQuery.preload(params.roomcode),
  component: RoomPage,
})
