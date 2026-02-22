import React from 'react'
import { Game } from "board-game-engine-react";

export default function PlayGame ({ gameConnection }) {
  return (
    <Game gameConnection={gameConnection} />
  )
}
