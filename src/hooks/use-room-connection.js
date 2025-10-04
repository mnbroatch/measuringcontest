import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query'
import { ActivePlayers } from 'boardgame.io/core';
import { serialize, deserialize } from "wackson";
import { useJoinRoomMutation } from "../queries/use-join-room-mutation.js";
import { useRoomQuery } from "../queries/use-room-query.js"
import { useGameserverConnection } from "./use-gameserver-connection.js";
import { registry } from "../../server/game-factory/registry.js";

const RoomGame = {
  name: 'bgestagingroom',
  setup: () => ({
    players: { '1': { name: 'Room Creator' } },
    status: 'waiting',
    gameRules: '',
    gameName: '',
  }),
  turn: {
    activePlayers: ActivePlayers.ALL,
  },
  moves: {
    join: ({G, playerID}, name) => {
      if (G.status === 'waiting') {
        G.players[playerID] = { name };
      }
    },
    leave: ({G, playerID}) => {
      if (playerID !== '1') {
        delete G.players[playerID]
      }
    },
    setGameMeta: ({G, playerID}, { gameRules, gameName }) => {
      if (playerID === '1') {
        G.gameRules = gameRules
        G.gameName = gameName
      }
    },
    gameCreated: ({G, playerID}, newGameId) => {
      if (playerID === '0') {
        G.gameId = newGameId;
        G.status = 'started';
      }
    },
  },
};

export default function useRoomConnection () {
  const navigate = useNavigate()
  const { roomcode: roomCode } = useParams({})
  const queryClient = useQueryClient()
  const room = useRoomQuery(roomCode).data
  const roomGameId = room?.roomGameId

  const joinRoomMutation = useJoinRoomMutation(roomCode)
  const boardgamePlayerID = joinRoomMutation.data?.boardgamePlayerID
  const clientToken = joinRoomMutation.data?.clientToken

  const game = RoomGame

  const client = useGameserverConnection({ gameId: roomGameId, game, boardgamePlayerID, clientToken })
  const clientState = client?.getState()
  const status = clientState?.G.status
  const gameId = clientState?.G.gameId
  const players = clientState?.G.players

  const prevStatusRef = useRef(status)

  useEffect(() => {
    if (prevStatusRef.current === 'waiting' && status === 'started') {
      if (boardgamePlayerID in players) {
        navigate({
          to: '/rooms/$roomcode/games/$gameid/play',
          params: {
            roomcode: roomCode,
            gameid: gameId,
          },
        })
      } else {
        queryClient.invalidateQueries({ queryKey: ['room', roomCode] })
      }
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

function preparePayload (payload) {
  const payloadCopy = { ...payload }
  payloadCopy.entities =
    Object.entries(payloadCopy.entities).reduce((acc, [key, entity]) => ({
      ...acc,
      [key]: entity.entityId
    }), {})
  return JSON.parse(serialize(payloadCopy))
}
