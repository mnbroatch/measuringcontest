import { useEffect, useMemo } from 'react'
import { useParams } from '@tanstack/react-router';
import { useJoinGameMutation } from "../queries/use-join-game-mutation.js";
import { useRoomQuery } from "../queries/use-room-query.js"
import { useGameserverConnection } from "board-game-engine-react";
import { BOARDGAME_SERVER_URL } from '../constants/api.js'
import { normalizeGameRules } from '../utils/game-rules-object.js'

export default function useGameConnection () {
  const { roomcode: roomCode } = useParams({})
  const room = useRoomQuery(roomCode).data
  const gameId = room?.gameId
  const rulesHash = room?.rulesHash
  console.log('room', room)
  const gameRules = useMemo(
    () => normalizeGameRules(room?.gameRules),
    [room?.gameRules]
  )

  const joinGameMutation = useJoinGameMutation(roomCode, gameId)
  const boardgamePlayerID = joinGameMutation.data?.boardgamePlayerID
  const clientToken = joinGameMutation.data?.clientToken

  useEffect (() => {
    if (roomCode && gameId) {
      joinGameMutation.mutate()
    }
  }, [roomCode, gameId])

  console.log('gameRules', gameRules)
  console.log('gameId', gameId)
  rulesHash
  console.log('boardgamePlayerID', boardgamePlayerID)
  console.log('clientToken', clientToken)
  console.log('joinGameMutation.isSuccess', joinGameMutation.isSuccess)
  console.log('BOARDGAME_SERVER_URL', BOARDGAME_SERVER_URL)

  return useGameserverConnection({
    server: BOARDGAME_SERVER_URL,
    matchID: gameId,
    gameRules,
    gameName: rulesHash, // this is what server expects
    playerID: boardgamePlayerID,
    credentials: clientToken,
    debug: false,
    enabled: joinGameMutation.isSuccess
  })
}
