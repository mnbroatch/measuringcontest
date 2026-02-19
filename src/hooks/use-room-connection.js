import { useEffect, useRef } from 'react'
import { useParams } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query'
import { useJoinRoomMutation } from "../queries/use-join-room-mutation.js";
import { useRoomQuery } from "../queries/use-room-query.js"
import { useGameserverConnection } from "./use-gameserver-connection.js";
import RoomGame from "../../server/room-game.js";

export default function useRoomConnection () {
  const { roomcode: roomCode } = useParams({})
  const queryClient = useQueryClient()
  const room = useRoomQuery(roomCode).data
  const roomGameId = room?.roomGameId

  const joinRoomMutation = useJoinRoomMutation(roomCode)
  const boardgamePlayerID = joinRoomMutation.data?.boardgamePlayerID
  const clientToken = joinRoomMutation.data?.clientToken

  const gameServerConnection = useGameserverConnection({
    gameId: roomGameId,
    game: RoomGame,
    boardgamePlayerID,
    clientToken,
    debug: false,
    enabled: !!joinRoomMutation.isSuccess
  })

  const status = gameServerConnection.state?.G.status
  const prevStatusRef = useRef(status)

  useEffect(() => {
    if (prevStatusRef.current === 'waiting' && status === 'started') {
      queryClient.invalidateQueries({ queryKey: ['room', roomCode] })
    }
    prevStatusRef.current = status
  }, [status])

  useEffect (() => {
    if (roomCode && roomGameId) {
      joinRoomMutation.mutate()
    }
  }, [roomCode, roomGameId])

  return gameServerConnection
}
