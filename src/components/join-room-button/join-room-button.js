import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

export default function JoinRoomButton () {
  const [roomCode, setRoomCode] = useState('')
  const navigate = useNavigate()

  return (
    <button
      className="join-room-button"
      onClick={() => {
        navigate({
          to: '/rooms/$roomcode',
          params: {
            roomcode: roomCode,
          }
        })
      }}
    >
      Join Room:
      <input
        className="join-room-button__input"
        onClick={(e) => { e.stopPropagation() }}
        onChange={(e) => {
          setRoomCode(e.target.value)}
        }
        value={roomCode}
      >
      </input>
    </button>
  )
}
