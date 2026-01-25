import React, { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import GameEditor from "../components/game-staging/game-editor.js";
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import { useCreateRoomMutation } from "../queries/use-create-room-mutation.js";
import { useMyRoomsQuery } from "../queries/use-my-rooms-query.js";

export default function Editor () {
  const navigate = useNavigate()
  const createRoomMutation = useCreateRoomMutation()
  const myRooms = useMyRoomsQuery()
  const roomCode = myRooms.data?.[0]
  const auth = useCognitoAuth()

  return (
    <GameEditor
      auth={auth}
      handleCreateRoom={async ({ gameRules, gameName }) => {
        const roomCode = await createRoomMutation.mutateAsync({gameRules, gameName})
        if (typeof roomCode === 'string') {
          navigate({
            to: '/rooms/$roomcode',
            params: { roomcode: roomCode }
          })
        }
      }}
      roomCode={roomCode}
      goToRoom={() => {
        navigate({
          to: '/rooms/$roomcode',
          params: { roomcode: roomCode }
        })
      }}
    />
  )
}

export const Route = createFileRoute('/editor')({
  loader: async () => {
    return useMyRoomsQuery.preload()
  },
  component: Editor,
})
