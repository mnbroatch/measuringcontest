import React from 'react'
import Game from "../game/game.js";
import { GameProvider } from "../../contexts/game-context.js";

export default function WatchGame ({ gameConnection }) {
  return (
    <GameProvider
      moves={gameConnection.moves}
      G={gameConnection.state.G}
      isSpectator
    >
      <Game state={gameConnection.state.G} />
    </GameProvider>
  )
}
