import React from 'react'
import Game from "../game/game.js";
import { GameProvider } from "../../contexts/game-context.js";

export default function PlayGame ({ gameConnection }) {
  return (
    <GameProvider moves={gameConnection.moves} bgioState={gameConnection.state}>
      <Game state={gameConnection.state.G} />
    </GameProvider>
  )
}
