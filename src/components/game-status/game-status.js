import React from 'react'
import Game from "../game/game.js";
import { GameProvider } from "../../contexts/game-context.js";

export default function GameStatus ({ gameConnection }) {
  return gameConnection.state.gameover && (
    <pre>
      {JSON.stringify(gameConnection.state.gameover)}
    </pre>
  )
}
