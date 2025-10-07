import React from 'react'
import Game from "../game/game.js";
import { GameProvider } from "../../contexts/game-context.js";

export default function GameStatus ({ gameConnection }) {
  return gameConnection.state.ctx.gameover && (
    <pre>
      {JSON.stringify(gameConnection.state.ctx.gameover)}
    </pre>
  )
}
