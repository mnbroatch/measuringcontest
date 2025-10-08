import React from 'react'
import Game from "../game/game.js";
import { GameProvider } from "../../contexts/game-context.js";

export default function WatchGame ({ gameConnection }) {
  return (
    <GameProvider
      gameConnection={gameConnection}
      isSpectator
    >
      <Game bgioState={gameConnection.state} />
    </GameProvider>
  )
}
