import React from 'react'
import { Game } from "board-game-engine-react";

export default function WatchGame ({ gameConnection }) {
  return (
    <Game
      gameConnection={gameConnection}
      isSpectator
    />
  )
}
