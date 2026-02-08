import React, { useState, useEffect } from 'react'
import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router"
import { Trash2 } from 'lucide-react';
import useRoomConnection from "../hooks/use-room-connection.js";
import useGameConnection from "../hooks/use-game-connection.js";
import { useRoomQuery } from "../queries/use-room-query.js";
import { useLeaveRoomMutation } from "../queries/use-leave-room-mutation.js";
import { useDeleteRoomMutation } from "../queries/use-delete-room-mutation.js";
import { useCreateGameMutation } from "../queries/use-create-game-mutation.js";
import { useDeleteGameMutation } from "../queries/use-delete-game-mutation.js";
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import { useLoading } from "../contexts/loading-context.js";
import PlayGame from "../components/play-game/play-game.js";
import WatchGame from "../components/watch-game/watch-game.js";
import GameStatus from "../components/game-status/game-status.js";
import RoomGame from "../components/game-staging/room-game.js";
import GamePreview from "../components/game-staging/game-preview.js";
import GameEditor from "../components/game-staging/game-editor.js";

const SCREEN_STATE_EDITING = 'editing'
const SCREEN_STATE_WAITING = 'waiting'

export default function RoomPage () {
  const roomCode = Route.useParams().roomcode?.toLowerCase()
  const navigate = useNavigate()
  const auth = useCognitoAuth()
  const { startLoading } = useLoading()
  const userId = auth.userId
  const leaveRoomMutation = useLeaveRoomMutation(roomCode)
  const deleteRoomMutation = useDeleteRoomMutation()

  const room = useRoomQuery(roomCode)
  const iAmInRoom = room.data.members && userId in room.data.members
  const iAmRoomCreator = userId && room.data.createdBy === userId 
  const roomConnection = useRoomConnection()
  const gameConnection = useGameConnection()
  console.log('gameConnection.state', gameConnection)
  const status = roomConnection.state?.G.status
  const players = roomConnection.state?.G.players
  const playerID = roomConnection.client?.playerID
  const gameRules = roomConnection.state?.G.gameRules
  const gameName = roomConnection.state?.G.gameName
  const gameId = roomConnection.state?.G.gameId
  const iAmInGame = room.data.players && userId in room.data.players
  const numPlayers = players && Object.keys(players).length

  const [screenState, setScreenState] = useState(SCREEN_STATE_WAITING)
  const [isTimedOut, setIsTimedOut] = useState(false)
  const createGameMutation = useCreateGameMutation(roomCode)
  const deleteGameMutation = useDeleteGameMutation(roomCode, gameId)
  const isLoading = room.isLoading
    || !roomConnection.state
    || (status === 'started' && !gameConnection.state)

  let gameDisabledReason = null
  let minPlayers, maxPlayers
  try {
    ({ minPlayers, maxPlayers } = JSON.parse(gameRules))
    if (maxPlayers && numPlayers > maxPlayers) {
      gameDisabledReason = 'Too Many Players'
    } else if (minPlayers && numPlayers < minPlayers) {
      gameDisabledReason = 'Not Enough Players'
    }
  } catch {
    gameDisabledReason = 'Invalid Game Rules'
  }

  useEffect(() => {
    if (status === 'deleted') {
      navigate({
        to: '/',
      })
    }
  }, [status])

  useEffect(() => {
    setTimeout(() => {
      setIsTimedOut(true)
    }, 5000)
  }, [])

  if (room.isSuccess && iAmRoomCreator && !roomConnection.state && isTimedOut) {
    return (
      <button
        className="button button--style-c"
        onClick={async () => {
          startLoading()
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

  let playerCountString = ''
  if (minPlayers > maxPlayers) {
    playerCountString = 'Invalid maxPlayers is less than minPlayers'
  } else {
    playerCountString += minPlayers?.toString() || '1'
    if (maxPlayers && maxPlayers !== minPlayers) {
      playerCountString += ` - ${maxPlayers}`
    } else if (!maxPlayers) {
      playerCountString += '+'
    }
    playerCountString += minPlayers > 1 || maxPlayers > 1 ? ' Players' : ' Player'
  }

  return !isLoading && iAmInRoom && (
    <>
      {status === 'waiting' && screenState === SCREEN_STATE_WAITING && (
        <>
          <h3 className="room-game__game-name">{gameName}</h3>
          <h5 className="room-game__player-count">{playerCountString}</h5>
          <RoomGame
            players={players}
            playerID={playerID}
            changeName={(name) => {
              roomConnection.client.moves.join(name)
            }}
          />
          <GamePreview gameRules={gameRules} roomCode={roomCode} />
          <div className="buttons">
            {iAmRoomCreator && (
              <>
                <button
                  className="button button--x-small button--style-c"
                  onClick={async () => {
                    startLoading()
                    await deleteRoomMutation.mutateAsync(roomCode)
                    navigate({
                      to: '/',
                    })
                  }}
                >
                  <Trash2 size="1em" />
                </button>
                <button
                  className="button button--x-small button--style-a"
                  onClick={() => { setScreenState(SCREEN_STATE_EDITING) }}
                >
                  Edit Game
                </button>
                <button
                  className="button button--x-small button--style-a"
                  disabled={!!gameDisabledReason}
                  onClick={() => {
                    createGameMutation.mutate({
                      gameRules,
                      gameName,
                      players,
                    })
                  }}
                >
                  {gameDisabledReason || 'Start Game'}
                </button>
              </>
            )}
            {!iAmRoomCreator && (
              <button
                className="button button--x-small button--style-c"
                disabled={leaveRoomMutation.isPending || leaveRoomMutation.isSuccess}
                onClick={async () => {
                  startLoading()
                  await leaveRoomMutation.mutateAsync(roomCode)
                  navigate({
                    to: '/',
                  })
                }}
              >
                Leave Room
              </button>
            )}
          </div>
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
  loader: async ({ params }) => {
    try {
      return await useRoomQuery.preload(params.roomcode)
    } catch (error) {
      throw redirect({
        to: '/',
        search: {failedroom: params.roomcode}
      })
    }
  },
  component: RoomPage,
})
