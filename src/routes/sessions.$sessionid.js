import React from 'react'
import { createFileRoute } from "@tanstack/react-router"
import { useSessionQuery } from "../queries/use-session-query.js";
import { useJoinSessionMutation } from "../queries/use-join-session-mutation.js";
import { useLeaveSessionMutation } from "../queries/use-leave-session-mutation.js";
import { useMeQuery } from "../queries/use-me-query.js";

export default function SessionPage () {
  const { sessionid: sessionId } = Route.useParams()
  const session = useSessionQuery(sessionId)
  const me = useMeQuery()
  const joinSessionMutation = useJoinSessionMutation(sessionId)
  const leaveSessionMutation = useLeaveSessionMutation(sessionId)
  return !session.isLoading && !me.isLoading && (
    <>
      {!session.data.members.includes(me.data.userId) && (
        <button onClick={joinSessionMutation.mutate}>
          Join
        </button>
      )}
      {session.data.members.includes(me.data.userId) && (
        <button onClick={leaveSessionMutation.mutate}>
          Leave
        </button>
      )}
      <pre>
        {session.data.members}
      </pre>
    </>
  )
}

export const Route = createFileRoute("/sessions/$sessionid")({
  loader: ({ params }) => Promise.all([useSessionQuery.preload(params.sessionid), useMeQuery.preload()]),
  component: SessionPage,
})
