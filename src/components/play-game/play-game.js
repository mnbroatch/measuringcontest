import React from 'react'
import Game from "../game/game.js";
import { GameProvider } from "../../contexts/game-context.js";

export default function PlayGame ({ gameConnection }) {
  console.log('gameConnection.moves', gameConnection.moves)
  return (
    <GameProvider gameConnection={gameConnection}>
      <Game bgioState={gameConnection.state} />
      <button onClick={() => {gameConnection.moves.pass()}}>
        pass
      </button>
    </GameProvider>
  )
}
