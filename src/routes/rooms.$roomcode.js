import React, { useState } from 'react'
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import useRoomConnection from "../hooks/use-room-connection.js";
import { useRoomQuery } from "../queries/use-room-query.js";
import { useLeaveRoomMutation } from "../queries/use-leave-room-mutation.js";
import { useCreateGameMutation } from "../queries/use-create-game-mutation.js";
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import ticTacToe from "../../server/tic-tac-toe.json";

export default function RoomPage () {
  const { roomcode: roomCode } = Route.useParams()
  const navigate = useNavigate()
  const { userId } = useCognitoAuth()
  const room = useRoomQuery(roomCode)
  const leaveRoomMutation = useLeaveRoomMutation(roomCode)
  const createGameMutation = useCreateGameMutation(roomCode)
  const game = useRoomConnection()

  const [gameRules, setGameRules] = useState(JSON.stringify(ticTacToe, null, 2))

  const iAmInRoom = room.data.members && userId in room.data.members
  const iAmInGame = room.data.players && userId in room.data.players

  return !room.isLoading && iAmInRoom && (
    <>
      <div>
        <button
          disabled={leaveRoomMutation.isPending || leaveRoomMutation.isSuccess}
          onClick={async () => {
            await leaveRoomMutation.mutateAsync()
            navigate({ to: '/', replace: true })
          }}
        >
          Leave Room
        </button>
      </div>
          <button
            onClick={() => {
              game.client.moves.join(Math.random())
            }}
          >
            blah
          </button>
      {room.data.gameId && (
        <div>
          <h3>
            {room.data.gameName}
          </h3>
          <pre style={{ width: '70%', height: '25vh', overflow: 'scroll' }}>
            {JSON.stringify(JSON.parse(room.data.gameRules), null, 2)}
          </pre>
          <button
            onClick={async () => {
              if (!iAmInGame) {
                await joinGameMutation.mutateAsync()
              }
              navigate({
                to: '/rooms/$roomcode/games/$gameid/play',
                params: {
                  roomcode: roomCode,
                  gameid: room.data.gameId,
                },
              })
            }}
          >
            {iAmInGame ? 'Rejoin Game' : 'Join Game' }
          </button>
          {!iAmInGame && (
            <button
              onClick={async () => {
                navigate({
                  to: '/rooms/$roomcode/games/$gameid/watch',
                  params: {
                    roomcode: roomCode,
                    gameid: room.data.gameId,
                  },
                })
              }}
            >
              Spectate Game
            </button>
          )}
        </div>
      )}
      {userId && room.data.createdBy === userId && !room.data.gameId && (
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
          <button onClick={() => { createGameMutation.mutate(gameRules) }}>
            Create Game
          </button>
        </div>
      )}
    </>
  )
}

export const Route = createFileRoute("/rooms/$roomcode")({
  loader: ({ params }) => useRoomQuery.preload(params.roomcode),
  component: RoomPage,
})
