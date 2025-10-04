import React from 'react'
import Game from "../game/game.js";

export default function PlayGame ({ gameConnection }) {
  return <>

      {gameConnection.state.G.sharedBoard[0].spaces.map((space, i) =>  (
        <button key={i} onClick={() => { gameConnection.moves?.placePlayerMarker(makePayload(gameConnection.state.G, i)) }}>
          Do {i}
        </button>
      ))}

    <Game state={gameConnection.state.G} />
  </>
}

function makePayload (G, n) {
  return { entities: { destination: G.sharedBoard[0].spaces[n] } }
}

