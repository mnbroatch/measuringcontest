import React from 'react'

export default function RoomGame ({ players, playerID }) {
  return (
    <div className="room-game">
      <h4>
        Joined Players:
      </h4>
      <ul>
        {Object.entries(players).map(([pID, player], i) => (
          <li
            key={i}
            style={{
              color: playerID === pID ? 'green' : 'inherit'
            }}
          >
            {player.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
