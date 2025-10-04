import React from 'react'
import Game from "../game/game.js";

export default function PlayGame ({ gameConnection }) {
  return <>


      <button
        onClick={() => {
          roomConnection.client.moves.placePlayerMarker()
        }}
      >
        do 1
      </button>

    <Game state={gameConnection.state.G} />
  </>
}
