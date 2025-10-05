import React from 'react'
import Game from "../game/game.js";

export default function WatchGame ({ gameConnection }) {
  return <Game state={gameConnection.state.G} />
}
