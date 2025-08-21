import React from 'react'
import { createFileRoute, Link } from "@tanstack/react-router"
import { useCreateSessionMutation } from "../queries/use-create-session-mutation.js";
import { useDeleteSessionMutation } from "../queries/use-delete-session-mutation.js";
import { useMeQuery } from "../queries/use-me-query.js";

export default function IndexPage () {
  const createSessionMutation = useCreateSessionMutation()
  const deleteSessionMutation = useDeleteSessionMutation()
  const me = useMeQuery()
  return !me.isLoading && me.data && (
    <>
      {!me.data?.sessions?.length && (
        <button onClick={createSessionMutation.mutate}>
          create session
        </button>
      )}
      {me.data?.sessions?.length > 0 && me.data.sessions.map((sessionId, i) => (
        <React.Fragment key={i+'delete'}>
          <Link
            to="/sessions/$sessionid"
            params={{
              sessionid: sessionId,
            }}
          >
            {sessionId}
          </Link>
          <button onClick={() => { deleteSessionMutation.mutate(sessionId) }}>
            delete
          </button>
        </React.Fragment >
      ))}
    </>
  )
}

export const Route = createFileRoute("/")({
  component: IndexPage
})
