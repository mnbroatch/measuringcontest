import React from 'react'
import { createFileRoute } from "@tanstack/react-router"
import { useCreateSessionMutation } from "../queries/use-create-session-mutation.js";
import { useDeleteSessionMutation } from "../queries/use-delete-session-mutation.js";
import { useSessionQuery } from "../queries/use-session-query.js";

export default function SessionPage () {
  const { sessionid: sessionId } = Route.useParams()
  const session = useSessionQuery(sessionId)
  return !session.isLoading && (
    <pre>
      {JSON.stringify(session.data)}
    </pre>
  )
}

export const Route = createFileRoute("/sessions/$sessionid")({
  component: SessionPage
})
