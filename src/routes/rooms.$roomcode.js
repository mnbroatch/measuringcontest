import React, { useState } from 'react'
import { createFileRoute } from "@tanstack/react-router"
import { serialize } from 'wackson';
import { useRoomQuery } from "../queries/use-room-query.js";
import { useJoinRoomMutation } from "../queries/use-join-room-mutation.js";
import { useLeaveRoomMutation } from "../queries/use-leave-room-mutation.js";
import { useCreateGameMutation } from "../queries/use-create-game-mutation.js";
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import useGame from "../hooks/use-game.js";
import ticTacToe from "../../server/tic-tac-toe.json";
import conditionFactory from '../../server/game-factory/condition/condition-factory.js'

export default function RoomPage () {
  const { roomcode: roomCode } = Route.useParams()
  const [gameRules, setGameRules] = useState(JSON.stringify(ticTacToe, null, 2))
  const { userId } = useCognitoAuth()
  const room = useRoomQuery(roomCode)
  const joinRoomMutation = useJoinRoomMutation(roomCode)
  const leaveRoomMutation = useLeaveRoomMutation(roomCode)
  const createGameMutation = useCreateGameMutation(roomCode)
  const { state, moves, client, game, gameover } = useGame()

  if (state) {
    console.log('game.endIf.toString()', game.endIf.toString())
    console.log('game.endIf(state)', game.endIf({ ...state, G: JSON.parse(serialize(state.G)) }))
  }
  console.log('gameover', gameover)

  const G = state?.G

  return !room.isLoading && (
    <>
      {!room.data.members?.includes(userId) && (
        <button onClick={joinRoomMutation.mutate}>
          Join
        </button>
      )}
      <textarea onChange={(e) => {setGameRules(e.target.value)}} value={gameRules}></textarea>
      {userId && room.data.createdBy === userId && (
        <button onClick={() => { createGameMutation.mutate(gameRules) }}>
          Create Game
        </button>
      )}
      {room.data.members?.includes(userId) && (
        <button onClick={leaveRoomMutation.mutate}>
          Leave
        </button>
      )}
      {G && (
        <pre>
          {JSON.stringify(G.sharedBoard, null, 2)}
        </pre>
      )}
      {G && G.sharedBoard[0].spaces.map((space, i) =>  (
        <button key={i} onClick={() => { moves?.placePlayerMarker(makePayload(G, i)) }}>
          Do {i}
        </button>
      ))}
      {G && (
        <button onClick={() => { client?.events.endTurn() }}>
          end turn
        </button>
      )}
      {G && (
        <button onClick={() => { client?.events.endTurn({ next: '0'}) }}>
          end turn +
        </button>
      )}
      {G && (
        <button onClick={() => { client?.events.endTurn({ next: '1'}) }}>
          end turn ++
        </button>
      )}
    </>
  )
}

function makePayload (G, n) {
  return { entities: { destination: G.sharedBoard[0].spaces[n] } }
}

export const Route = createFileRoute("/rooms/$roomcode")({
  loader: ({ params }) => useRoomQuery.preload(params.roomcode),
  component: RoomPage,
})

function getMatchingWinConditionResult(G, winConditions) {
  for (const winCondition of winConditions) {
    const conditionResults = [];

    for (const cond of winCondition.conditions) {
      const conditionResult = conditionFactory(cond).check({ G });

      if (conditionResult.conditionIsMet) {
        conditionResults.push(conditionResult);
      } else {
        break;
      }
    }

    if (conditionResults.length === winCondition.conditions.length) {
      return { winCondition, conditionResults };
    }
  }

  return null;
}
