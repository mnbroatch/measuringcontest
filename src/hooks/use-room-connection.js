import { useEffect, useReducer } from 'react'
import { useJoinRoomMutation } from "../queries/use-join-room-mutation.js";
import { useGameserverConnection } from "./use-gameserver-connection.js";

export default function useRoomConnection () {
  const [_, forceUpdate] = useReducer(x => !x, false)

  const joinRoomMutation = useJoinRoomMutation(123)

  useGameserverConnection()

  useEffect(() => {
    console.log("EFFECT");
  }, [Math.random()]);

  useEffect (() => {
    joinRoomMutation.mutate()
  }, [])
}

