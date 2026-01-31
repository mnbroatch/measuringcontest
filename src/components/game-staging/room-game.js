import React from 'react'
import PlayerPill from '../player-pill/player-pill.js'

export default function RoomGame ({ players, playerID, changeName }) {
  return (
    <div className="room-game">
      <div className="room-game__joined-players">
        <h4>
          Joined Players:
        </h4>
        <div>
          {Object.entries(players).map(([pID, player], i) => (
            <PlayerPill
              key={i}
              player={player}
              playerID={pID}
              myPlayerID={playerID}
              changeName={changeName}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
