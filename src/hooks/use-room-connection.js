import { useEffect } from 'react'
import { useParams } from '@tanstack/react-router';
import { ActivePlayers } from 'boardgame.io/core';
import { serialize, deserialize } from "wackson";
import { useJoinRoomMutation } from "../queries/use-join-room-mutation.js";
import { useRoomQuery } from "../queries/use-room-query.js"
import { useGameserverConnection } from "./use-gameserver-connection.js";
import { registry } from "../../server/game-factory/registry.js";

const RoomGame = {
  name: 'bgestagingroom',
  setup: () => ({
    players: [],
    gameRules: '',
    gameName: '',
  }),
  turn: {
    activePlayers: ActivePlayers.ALL,
  },
  moves: {
    join: ({G, playerID}, name) => {
      if (!G.players.some(player => player.id === playerID)) {
        G.players.push({ id: playerID, name });
      }
    },
  },
};

export default function useGameConnection () {
  const { roomcode: roomCode } = useParams({})
  const room = useRoomQuery(roomCode).data
  const roomGameId = room?.roomGameId

  const joinRoomMutation = useJoinRoomMutation(roomCode)
  const boardgamePlayerID = joinRoomMutation.data?.boardgamePlayerID
  const clientToken = joinRoomMutation.data?.clientToken

  const game = RoomGame

  const client = useGameserverConnection({ gameId: roomGameId, game, boardgamePlayerID, clientToken })
  const clientState = client?.getState()

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

function preparePayload (payload) {
  const payloadCopy = { ...payload }
  payloadCopy.entities =
    Object.entries(payloadCopy.entities).reduce((acc, [key, entity]) => ({
      ...acc,
      [key]: entity.entityId
    }), {})
  return JSON.parse(serialize(payloadCopy))
}
