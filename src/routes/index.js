import { createFileRoute } from "@tanstack/react-router"
import React from 'react'
import { useCreateSessionMutation } from "../queries/use-create-session-mutation.js";
import { useMeQuery } from "../queries/use-me-query.js";

export default function IndexPage () {
  const createSessionMutation = useCreateSessionMutation()
  const me = useMeQuery()
  return !me.isLoading && (
    <>
      {!me.data?.sessions?.length && (
        <button onClick={createSessionMutation.mutate}>
          create session
        </button>
      )}
      {me.data?.sessions?.length > 0 && me.data.sessions.map((sessionId, i) => (
        <a key={i} onClick={() => { console.log(sessionId) }}>
          {sessionId}
        </a>
      ))}
    </>
  )
}

export const Route = createFileRoute("/")({
  component: IndexPage
})
