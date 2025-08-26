import React, { useState } from 'react'
import { createFileRoute, Link } from "@tanstack/react-router"
import { useCreateRoomMutation } from "../queries/use-create-room-mutation.js";
import { useDeleteRoomMutation } from "../queries/use-delete-room-mutation.js";
import { useMyRoomsQuery } from "../queries/use-my-rooms-query.js";
import ticTacToe from "../tic-tac-toe.json";

export default function IndexPage () {
  const [roomCode, setRoomCode] = useState('')
  const [gameRules, setGameRules] = useState(JSON.stringify(ticTacToe, null, 2))
  const myRooms = useMyRoomsQuery()
  const createRoomMutation = useCreateRoomMutation()
  const deleteRoomMutation = useDeleteRoomMutation()
  return !myRooms.isLoading && myRooms.data && (
    <>
      <Link to="/">
        home
      </Link>
      <Link
        to="/board"
        params={{
          roomcode: roomCode,
        }}
      >
        board
      </Link>
      {!myRooms.data?.length && (
        <>
          <button onClick={() => { createRoomMutation.mutate(gameRules) }}>
            create room
          </button>
          <textarea onChange={(e) => {setGameRules(e.target.value)}} value={gameRules}></textarea>
          <Link
            to="/rooms/$roomcode"
            params={{
              roomcode: roomCode,
            }}
          >
            Go To Room
          </Link>
          <input onChange={(e) => {setRoomCode(e.target.value)}} value={roomCode}></input>
        </>
      )}
      {myRooms.data?.length > 0 && myRooms.data.map((roomCode, i) => (
        <React.Fragment key={i+'delete'}>
          <Link
            to="/rooms/$roomcode"
            params={{
              roomcode: roomCode,
            }}
          >
            {roomCode}
          </Link>
          <button onClick={() => { deleteRoomMutation.mutate(roomCode) }}>
            delete
          </button>
        </React.Fragment >
      ))}
    </>
  )
}

export const Route = createFileRoute("/")({
  loader: () => useMyRoomsQuery.preload(),
  component: IndexPage
})
