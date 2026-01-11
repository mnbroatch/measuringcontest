import React, { useState } from 'react'
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Trash2 } from 'lucide-react';
import useRoomConnection from "../hooks/use-room-connection.js";
import useGameConnection from "../hooks/use-game-connection.js";
import { useRoomQuery } from "../queries/use-room-query.js";
import { useLeaveRoomMutation } from "../queries/use-leave-room-mutation.js";
import { useDeleteRoomMutation } from "../queries/use-delete-room-mutation.js";
import { useCreateGameMutation } from "../queries/use-create-game-mutation.js";
import { useDeleteGameMutation } from "../queries/use-delete-game-mutation.js";
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import PlayGame from "../components/play-game/play-game.js";
import WatchGame from "../components/watch-game/watch-game.js";
import GameStatus from "../components/game-status/game-status.js";
import RoomGame from "../components/game-staging/room-game.js";
import GamePreview from "../components/game-staging/game-preview.js";
import GameEditor from "../components/game-staging/game-editor.js";
import ButtonWithInput from '../components/button-with-input/button-with-input.js'

const SCREEN_STATE_EDITING = 'editing'
const SCREEN_STATE_WAITING = 'waiting'

export default function RoomPage () {
  const { roomcode: roomCode } = Route.useParams()
  const { del } = Route.useSearch()
  const navigate = useNavigate()
  const auth = useCognitoAuth()
  const userId = auth.userId
  const leaveRoomMutation = useLeaveRoomMutation(roomCode)
  const deleteRoomMutation = useDeleteRoomMutation()

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

  const [screenState, setScreenState] = useState(SCREEN_STATE_WAITING)
  const createGameMutation = useCreateGameMutation(roomCode)
  const deleteGameMutation = useDeleteGameMutation(roomCode, gameId)

  const isLoading = room.isLoading
    || !roomConnection.state
    || (status === 'started' && !gameConnection.state)

  if (del) {
    return (
      <button
        className="button button--style-c"
        onClick={async () => {
          await deleteRoomMutation.mutateAsync(roomCode)
          navigate({
            to: '/',
          })
        }}
      >
        Delete Room
      </button>
    )
  }

  return !isLoading && iAmInRoom && (
    <>
      {status === 'waiting' && screenState === SCREEN_STATE_WAITING && (
        <>
          {!iAmRoomCreator && (
            <button
              className="button button--x-small button--style-c"
              disabled={leaveRoomMutation.isPending || leaveRoomMutation.isSuccess}
              onClick={async () => {
                await deleteRoomMutation.mutateAsync(roomCode)
                navigate({
                  to: '/',
                })
              }}
            >
              Leave Room
            </button>
          )}
          <ButtonWithInput
            className="button--x-small"
            defaultValue={players?.[playerID]?.name}
            label={ iAmInStagedGame ? 'Change name:' : 'Join Game as:' }
            handleClick={(name) => {
              roomConnection.client.moves.join(name)
            }}
          />
          <h3>{gameName}</h3>
          <RoomGame players={players} playerID={playerID} />
          <GamePreview gameRules={gameRules} />
          <div className="buttons">
            <button
              className="button button--x-small button--style-a"
              onClick={() => { setScreenState(SCREEN_STATE_EDITING) }}
            >
              Edit Game
            </button>
            <button
              className="button button--x-small button--style-a"
              onClick={() => {
                createGameMutation.mutate({
                  gameRules,
                  gameName,
                  players,
                })
              }}
            >
              Start Game
            </button>
          </div>
        </>
      )}
      {iAmRoomCreator && (
        <button
          className="button button--x-small button--style-c"
          onClick={async () => {
            await deleteRoomMutation.mutateAsync(roomCode)
            navigate({
              to: '/',
            })
          }}
        >
          <Trash2 size="1em" />
        </button>
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
        <button
          className="button button--x-small button--style-c"
          onClick={() => { deleteGameMutation.mutate() }}
        >
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
