import React from 'react'
import { createFileRoute } from "@tanstack/react-router"
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
  loader: ({ params }) => useSessionQuery.preload(params.sessionid),
  component: SessionPage,
})
