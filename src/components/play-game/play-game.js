import React from 'react'
import Game from "../game/game.js";
import { GameProvider } from "../../contexts/game-context.js";

export default function PlayGame ({ gameConnection }) {
  return <>
    <GameProvider moves={gameConnection.moves} G={gameConnection.state.G}>
      <Game state={gameConnection.state.G} />
    </GameProvider>
  </>
}

function makePayload (G, n) {
  return { entities: { destination: G.sharedBoard[0].spaces[n] } }
}

