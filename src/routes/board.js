import React, { useMemo, useEffect, useState } from 'react'
import { createFileRoute } from "@tanstack/react-router"
import { Client } from 'boardgame.io/client';
import { SocketIO } from 'boardgame.io/multiplayer'
import TicTacToe from '../../server/tic-tac-toe';
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";

const game = TicTacToe

export default function BoardGamePage () {
  const auth = useCognitoAuth()
  const [client, setClient] = useState(null)
  useEffect(() => {
    if (!client && auth.userId) {
      const newClient = new Client({
        game,
        matchID: '2',
        multiplayer: SocketIO({ server: 'localhost:8000' }),
        playerID: auth.userId
      })
      setClient(newClient)
      newClient.start()
    }
  }, [auth.userId, game])

  console.log(client)
  return null
}

export const Route = createFileRoute("/board")({
  component: BoardGamePage,
})

