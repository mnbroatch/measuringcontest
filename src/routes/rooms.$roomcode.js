import React, { useState } from 'react'
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import useRoomConnection from "../hooks/use-room-connection.js";
import useGameConnection from "../hooks/use-game-connection.js";
import { useRoomQuery } from "../queries/use-room-query.js";
import { useLeaveRoomMutation } from "../queries/use-leave-room-mutation.js";
import { useCreateGameMutation } from "../queries/use-create-game-mutation.js";
import { useDeleteGameMutation } from "../queries/use-delete-game-mutation.js";
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import PlayGame from "../components/play-game/play-game.js";
import WatchGame from "../components/watch-game/watch-game.js";
import GameStatus from "../components/game-status/game-status.js";
import RoomGame from "../components/game-staging/room-game.js";
import GamePreview from "../components/game-staging/game-preview.js";
import GameEditor from "../components/game-staging/game-editor.js";

const SCREEN_STATE_EDITING = 'editing'
const SCREEN_STATE_WAITING = 'waiting'

export default function RoomPage () {
  const { roomcode: roomCode } = Route.useParams()
  const navigate = useNavigate()
  const auth = useCognitoAuth()
  const userId = auth.userId
  const leaveRoomMutation = useLeaveRoomMutation(roomCode)

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
  const gameId = roomConnection.state?.G.gameId
  const iAmInStagedGame = players && roomConnection.client?.playerID in players
  const iAmInGame = room.data.players && userId in room.data.players

  const [name, setName] = useState(players?.[playerID]?.name)
  const [screenState, setScreenState] = useState(SCREEN_STATE_WAITING)
  const createGameMutation = useCreateGameMutation(roomCode)
  const deleteGameMutation = useDeleteGameMutation(roomCode, gameId)

  const isLoading = room.isLoading
    || !roomConnection.state
    || (status === 'started' && !gameConnection.state)

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
            { iAmInStagedGame ? 'Change my name to:' : 'Join Game as:' }
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

      {status === 'waiting' && (
        <GamePreview
          gameRules={gameRules}
          gameName={gameName}
        />
      )}
      {status === 'waiting' && iAmRoomCreator && screenState === SCREEN_STATE_WAITING && (
        <>
          <button onClick={() => { setScreenState(SCREEN_STATE_EDITING) }}>
            Edit Game
          </button>
          <button onClick={() => {
            createGameMutation.mutate({
              gameRules,
              gameName,
              players,
            })
          }}>
            Start Game
          </button>
        </>
      )}
      {status === 'waiting' && iAmRoomCreator && screenState === SCREEN_STATE_EDITING && (
        <GameEditor
          auth={auth}
          roomCode={roomCode}
          goToRoom={({ gameRules, gameName }) => {
            roomConnection.client.moves.setGameMeta({ gameRules, gameName })
            setScreenState(SCREEN_STATE_WAITING)
          }}
        />
      )}
      {status === 'started' && iAmInGame && (
        <PlayGame gameConnection={gameConnection} />
      )}
      {status === 'started' && !iAmInGame && (
        <WatchGame gameConnection={gameConnection} />
      )}
      {status === 'started' && (
        <GameStatus gameConnection={gameConnection} />
      )}
      {status === 'started' && iAmRoomCreator && (
        <button onClick={() => { deleteGameMutation.mutate() }}>
          Delete Game
        </button>
      )}
    </>
  )
}

export const Route = createFileRoute("/rooms/$roomcode")({
  loader: ({ params }) => useRoomQuery.preload(params.roomcode),
  component: RoomPage,
})
