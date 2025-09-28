import React, { useState } from 'react'
import { serialize } from 'wackson'
import { createFileRoute } from "@tanstack/react-router"
import { useRoomQuery } from "../queries/use-room-query.js";
import { useJoinRoomMutation } from "../queries/use-join-room-mutation.js";
import { useLeaveRoomMutation } from "../queries/use-leave-room-mutation.js";
import { useCreateGameMutation } from "../queries/use-create-game-mutation.js";
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import useGame from "../hooks/use-game.js";
import ticTacToe from "../tic-tac-toe.json";

export default function RoomPage () {
  const { roomcode: roomCode } = Route.useParams()
  const [gameRules, setGameRules] = useState(JSON.stringify(ticTacToe, null, 2))
  const { userId } = useCognitoAuth()
  const room = useRoomQuery(roomCode)
  const joinRoomMutation = useJoinRoomMutation(roomCode)
  const leaveRoomMutation = useLeaveRoomMutation(roomCode)
  const createGameMutation = useCreateGameMutation(roomCode)
  const { G, moves } = useGame()
  console.log('G', G)

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
          {serialize(G, { space: 2 })}
        </pre>
      )}
      {G && (
        <button onClick={() => { moves?.placePlayerMarker(makePayload(G, 1)) }}>
          Do 1
        </button>
      )}
      {G && (
        <button onClick={() => { moves?.placePlayerMarker(makePayload(G, 2)) }}>
          Do 2
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
