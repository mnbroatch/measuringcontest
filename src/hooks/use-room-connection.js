import { useEffect, useRef } from 'react'
import { useParams } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query'
import { deserialize } from "wackson";
import { useJoinRoomMutation } from "../queries/use-join-room-mutation.js";
import { useRoomQuery } from "../queries/use-room-query.js"
import { useGameserverConnection } from "./use-gameserver-connection.js";
import { registry } from "../../server/game-factory/registry.js";
import RoomGame from "../../server/room-game.js";
import preparePayload from "../utils/prepare-payload.js";

export default function useRoomConnection () {
  const { roomcode: roomCode } = useParams({})
  const queryClient = useQueryClient()
  const room = useRoomQuery(roomCode).data
  const roomGameId = room?.roomGameId

  const joinRoomMutation = useJoinRoomMutation(roomCode)
  const boardgamePlayerID = joinRoomMutation.data?.boardgamePlayerID
  const clientToken = joinRoomMutation.data?.clientToken

  const game = RoomGame

  const client = useGameserverConnection({
    gameId: roomGameId,
    game,
    boardgamePlayerID,
    clientToken,
    debug: false,
    enabled: !!joinRoomMutation.isSuccess
  })
  const clientState = client?.getState()
  const status = clientState?.G.status

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

  let state
  let moves
  let gameover
  if (clientState) {
    state = {
      ...clientState,
      G: deserialize(JSON.stringify(clientState.G), registry),
    }
    gameover = state?.ctx?.gameover
    moves = client && !gameover
      ? Object.entries(client.moves).reduce((acc, [moveName, m]) => {
        const move = function (payload) { m(preparePayload(payload)) }
        move.moveInstance = game.moves[moveName].moveInstance
        return {
          ...acc,
          [moveName]: move
        }
      }, {})
      : []
  }

  return {
    client,
    state,
    gameover,
    game,
    moves,
  }
}
