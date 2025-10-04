import { createFileRoute } from "@tanstack/react-router"
import useRoomConnection from "../hooks/use-room-connection.js";
import { useRoomQuery } from "../queries/use-room-query.js";

export default function RoomPage () {
  useRoomConnection()

  return null
}

export const Route = createFileRoute("/rooms/$roomcode")({
  loader: ({ params }) => useRoomQuery.preload(params.roomcode),
  component: RoomPage,
})
