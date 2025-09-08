import React, { useEffect } from 'react'
import { createFileRoute } from "@tanstack/react-router"
import { Client } from 'boardgame.io/client';
import { SocketIO } from 'boardgame.io/multiplayer'
import TicTacToe from '../../server/tic-tac-toe';
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";

class TicTacToeClient {
  constructor() {
    this.client = Client({
      game: TicTacToe,
      multiplayer: SocketIO({ server: 'localhost:8000' }),
    });
    this.client.start();
  }
}

export default function BoardGamePage () {
  const auth = useCognitoAuth()
  console.log('auth', auth)
  // new TicTacToeClient(appElement, { playerID: '0' });
  console.log('TicTacToeClient', TicTacToeClient)
  return null
  // return <BoardGameApp />
}

export const Route = createFileRoute("/board")({
  component: BoardGamePage,
})

