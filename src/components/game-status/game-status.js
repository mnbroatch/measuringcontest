import React from 'react'

export default function GameStatus ({ gameConnection }) {
  const players = gameConnection.client.matchData
  const winner = gameConnection.state.ctx.gameover.winner
  let winnerString = ''
  if (winner) {
    winnerString = `${players[winner].name} Wins!`
  }
  return gameConnection.state.ctx.gameover && (
    <div className="game-status">
      {winnerString}
    </div>
  )
}
