import React from 'react'
import { createFileRoute } from "@tanstack/react-router"
import { useSessionQuery } from "../queries/use-session-query.js";
import { useJoinSessionMutation } from "../queries/use-join-session-mutation.js";
import { useLeaveSessionMutation } from "../queries/use-leave-session-mutation.js";
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";

export default function SessionPage () {
  const { sessionid: sessionId } = Route.useParams()
  const { userId } = useCognitoAuth()
  const session = useSessionQuery(sessionId)
  const joinSessionMutation = useJoinSessionMutation(sessionId)
  const leaveSessionMutation = useLeaveSessionMutation(sessionId)

  return !session.isLoading && (
    <>
      {!session.data.members?.includes(userId) && (
        <button onClick={joinSessionMutation.mutate}>
          Join
        </button>
      )}
      {session.data.members?.includes(userId) && (
        <button onClick={leaveSessionMutation.mutate}>
          Leave
        </button>
      )}
      <pre>
        {JSON.stringify(session.data, null, 2)}
      </pre>
    </>
  )
}

export const Route = createFileRoute("/rooms/$roomid")({
  loader: ({ params }) => useSessionQuery.preload(params.sessionid),
  component: SessionPage,
})
