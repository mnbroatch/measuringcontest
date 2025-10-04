import React from 'react'
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import useRoomConnection from "../hooks/use-room-connection.js";
import useGameConnection from "../hooks/use-game-connection.js";
import { useRoomQuery } from "../queries/use-room-query.js";
import { useLeaveRoomMutation } from "../queries/use-leave-room-mutation.js";
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import GameStaging from "../components/game-staging/game-staging.js";
import PlayGame from "../components/play-game/play-game.js";
import WatchGame from "../components/watch-game/watch-game.js";

export default function RoomPage () {
  const { roomcode: roomCode } = Route.useParams()
  const navigate = useNavigate()
  const { userId } = useCognitoAuth()
  const room = useRoomQuery(roomCode)
  const leaveRoomMutation = useLeaveRoomMutation(roomCode)
  const roomConnection = useRoomConnection()
  const gameConnection = useGameConnection()

  const iAmInRoom = room.data.members && userId in room.data.members
  const iAmInGame = room.data.players && userId in room.data.players
  const iAmRoomCreator = userId && room.data.createdBy === userId 
  const status = roomConnection.state?.G.status

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
      {status === 'waiting' && (
        <GameStaging
          iAmRoomCreator={iAmRoomCreator}
          room={room}
          roomConnection={roomConnection}
        />
      )}
      {status === 'started' && gameConnection.state && iAmInGame && (
        <PlayGame
          room={room}
          gameConnection={gameConnection}
        />
      )}
      {status === 'started' && gameConnection.state && !iAmInGame && (
        <WatchGame
          room={room}
          gameConnection={gameConnection}
        />
      )}
    </>
  )
}

export const Route = createFileRoute("/rooms/$roomcode")({
  loader: ({ params }) => useRoomQuery.preload(params.roomcode),
  component: RoomPage,
})
