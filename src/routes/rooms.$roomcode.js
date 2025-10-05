import React, { useState } from 'react'
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import useRoomConnection from "../hooks/use-room-connection.js";
import useGameConnection from "../hooks/use-game-connection.js";
import { useRoomQuery } from "../queries/use-room-query.js";
import { useLeaveRoomMutation } from "../queries/use-leave-room-mutation.js";
import { useCreateGameMutation } from "../queries/use-create-game-mutation.js";
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import PlayGame from "../components/play-game/play-game.js";
import WatchGame from "../components/watch-game/watch-game.js";
import RoomGame from "../components/game-staging/room-game.js";
import GamePreview from "../components/game-staging/game-preview.js";
import GameEditor from "../components/game-staging/game-editor.js";

export default function RoomPage () {
  const { roomcode: roomCode } = Route.useParams()
  const navigate = useNavigate()
  const { userId } = useCognitoAuth()
  const leaveRoomMutation = useLeaveRoomMutation(roomCode)
  const createGameMutation = useCreateGameMutation(roomCode)

  const room = useRoomQuery(roomCode)
  const iAmInRoom = room.data.members && userId in room.data.members
  const iAmRoomCreator = userId && room.data.createdBy === userId 
  const roomConnection = useRoomConnection()
  const gameConnection = useGameConnection()
  const status = roomConnection.state?.G.status
  const players = roomConnection.state?.G.players
  const playerID = roomConnection.client?.playerID
  const gameRules = roomConnection.state?.G.gameRules
  const gameName = roomConnection.state?.G.gameName
  const iAmInGame = players && roomConnection.client?.playerID in players

  const [name, setName] = useState(players?.[playerID]?.name)

  const isLoading = room.isLoading
    || !roomConnection.state
    || (!gameConnection.state && room.data.gameId)

  return !isLoading && iAmInRoom && (
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
        <>
          <RoomGame players={players} playerID={playerID} />
          <button
            onClick={() => {
              roomConnection.client.moves.join(name)
            }}
          >
            { iAmInGame ? 'Change name to:' : 'Join Game as:' }
            <input
              onClick={(e) => {e.stopPropagation()}}
              onChange={(e) => {
                setName(e.target.value)}
              }
              value={name}
            >
            </input>
          </button>
        </>
      )}

      {status === 'waiting' && !iAmRoomCreator && (
        <GamePreview
          gameRules={gameRules}
          gameName={gameName}
        />
      )}
      {status === 'waiting' && iAmRoomCreator && (
        <>
          <GameEditor
            roomCode={roomCode}
            initialGameRules={gameRules}
            initialGameName={gameName}
            players={players}
            saveGame={roomConnection.client.moves.setGameMeta}
          />
          <button onClick={() => {
            createGameMutation.mutate({
              gameRules,
              gameName,
              players
            })
          }}>
            Create Game
          </button>
        </>
      )}
      {status === 'started' && iAmInGame && (
        <PlayGame gameConnection={gameConnection} />
      )}
      {status === 'started' && !iAmInGame && (
        <WatchGame gameConnection={gameConnection} />
      )}
    </>
  )
}

export const Route = createFileRoute("/rooms/$roomcode")({
  loader: ({ params }) => useRoomQuery.preload(params.roomcode),
  component: RoomPage,
})
