import { useEffect } from 'react'
import { useParams } from '@tanstack/react-router';
import { useJoinGameMutation } from "../queries/use-join-game-mutation.js";
import { useRoomQuery } from "../queries/use-room-query.js"
import { useGameserverConnection } from "./use-gameserver-connection.js";

export default function useGameConnection () {
  const { roomcode: roomCode } = useParams({})
  const room = useRoomQuery(roomCode).data
  const gameId = room?.gameId
  const rulesHash = room?.rulesHash
  const gameRules = room?.gameRules

  const joinGameMutation = useJoinGameMutation(roomCode, gameId)
  const boardgamePlayerID = joinGameMutation.data?.boardgamePlayerID
  const clientToken = joinGameMutation.data?.clientToken

  useEffect (() => {
    if (roomCode && gameId) {
      joinGameMutation.mutate()
    }
  }, [roomCode, gameId])

  return useGameserverConnection({
    gameId,
    gameRules,
    rulesHash,
    boardgamePlayerID,
    clientToken,
    debug: false,
    enabled: joinGameMutation.isSuccess
  })
}
