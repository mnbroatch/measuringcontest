import React from 'react'

export default function RoomGame ({ players, playerID }) {
  return (
    <div className="room-game">
      <div className="room-game__joined-players">
        <h4>
          Joined Players:
        </h4>
        <div>
          {Object.entries(players).map(([pID, player], i) => (
            <div
              key={i}
              className={[
                'joined-player-pill',
                playerID === pID && 'joined-player-pill--me'
              ].filter(Boolean).join(' ')}
              style={{
                display: 'inline-block',
              }}
            >
              {player.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
