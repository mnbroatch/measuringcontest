import React from 'react'
import { createFileRoute } from "@tanstack/react-router"
import { useRoomQuery } from "../queries/use-room-query.js";
import { useJoinRoomMutation } from "../queries/use-join-room-mutation.js";
import { useLeaveRoomMutation } from "../queries/use-leave-room-mutation.js";
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";

export default function RoomPage () {
  const { roomcode: roomCode } = Route.useParams()
  const { userId } = useCognitoAuth()
  const room = useRoomQuery(roomCode)
  const joinRoomMutation = useJoinRoomMutation(roomCode)
  const leaveRoomMutation = useLeaveRoomMutation(roomCode)

  return !room.isLoading && (
    <>
      {!room.data.members?.includes(userId) && (
        <button onClick={joinRoomMutation.mutate}>
          Join
        </button>
      )}
      {room.data.members?.includes(userId) && (
        <button onClick={leaveRoomMutation.mutate}>
          Leave
        </button>
      )}
      <pre>
        {JSON.stringify(room.data, null, 2)}
      </pre>
    </>
  )
}

export const Route = createFileRoute("/rooms/$roomcode")({
  loader: ({ params }) => useRoomQuery.preload(params.roomcode),
  component: RoomPage,
})
