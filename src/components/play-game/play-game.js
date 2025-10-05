import React from 'react'
import Game from "../game/game.js";
import { GameProvider } from "../../contexts/game-context.js";

export default function PlayGame ({ gameConnection }) {
  console.log('gameConnection.state', gameConnection.state)
  return <>
    {gameConnection.state.G.sharedBoard[0].spaces.map((space, i) =>  (
      <button key={i} onClick={() => { gameConnection.moves?.placePlayerMarker(makePayload(gameConnection.state.G, i)) }}>
        Do {i}
      </button>
    ))}

    
    <GameProvider moves={gameConnection.moves}>
      <Game state={gameConnection.state.G} />
    </GameProvider>
  </>
}

function makePayload (G, n) {
  return { entities: { destination: G.sharedBoard[0].spaces[n] } }
}

