import { useEffect, useMemo } from 'react'
import { useParams } from '@tanstack/react-router';
import { serialize, deserialize } from "wackson";
import { useJoinGameMutation } from "../queries/use-join-game-mutation.js";
import { useRoomQuery } from "../queries/use-room-query.js"
import { useGameserverConnection } from "./use-gameserver-connection.js";
import gameFactory from '../../server/game-factory/game-factory.js'
import { registry } from "../../server/game-factory/registry.js";

export default function useGameConnection () {
  const { roomcode: roomCode } = useParams({})
  const room = useRoomQuery(roomCode).data
  const gameId = room?.gameId
  const rulesHash = room?.rulesHash
  const gameRules = room?.gameRules

  const joinGameMutation = useJoinGameMutation(roomCode, gameId)
  const boardgamePlayerID = joinGameMutation.data?.boardgamePlayerID
  const clientToken = joinGameMutation.data?.clientToken

  const game = useMemo(() => gameRules && gameFactory(JSON.parse(gameRules), rulesHash), [gameRules, rulesHash])

  const client = useGameserverConnection({
    gameId,
    game,
    boardgamePlayerID,
    clientToken,
    enabled: joinGameMutation.isSuccess
  })
  const clientState = client?.getState()

  useEffect (() => {
    if (roomCode && gameId) {
      joinGameMutation.mutate()
    }
  }, [roomCode, gameId])

  let state
  let moves
  let gameover
  if (game && clientState) {
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

function preparePayload (payload) {
  const payloadCopy = { ...payload }
  payloadCopy.entities =
    Object.entries(payloadCopy.entities).reduce((acc, [key, entity]) => ({
      ...acc,
      [key]: entity.entityId
    }), {})
  return JSON.parse(serialize(payloadCopy))
}
