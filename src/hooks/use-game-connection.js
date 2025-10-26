import { useEffect, useMemo } from 'react'
import { useParams } from '@tanstack/react-router';
import { serialize, deserialize } from "wackson";
import { useJoinGameMutation } from "../queries/use-join-game-mutation.js";
import { useRoomQuery } from "../queries/use-room-query.js"
import { useGameserverConnection } from "./use-gameserver-connection.js";
import gameFactory from '../../server/game-factory/game-factory.js'
import { registry } from "../../server/game-factory/registry.js";
import preparePayload from "../../server/game-factory/utils/prepare-payload.js";
import getCurrentMoves from "../../server/game-factory/utils/get-current-moves.js";

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
      originalG: clientState.G,
    }
    gameover = state?.ctx?.gameover

    moves = !gameover
      ? Object.entries(getCurrentMoves(game, state, client.playerID)).reduce((acc, [moveName, rawMove]) => {
          const move = function (payload) {
            client.moves[moveName](preparePayload(payload))
          }
          move.moveInstance = rawMove.moveInstance
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
