import { createFileRoute } from "@tanstack/react-router"
import React from 'react'
import BoardGameApp from "../../../board-game-engine/app.tsx";

export default function BoardGamePage () {
  return <BoardGameApp />
}

export const Route = createFileRoute("/board")({
  component: BoardGamePage,
})

