import React, { useState } from 'react'
import { createFileRoute, Link } from "@tanstack/react-router"
import { useCreateSessionMutation } from "../queries/use-create-session-mutation.js";
import { useDeleteSessionMutation } from "../queries/use-delete-session-mutation.js";
import { useMeQuery } from "../queries/use-me-query.js";

export default function IndexPage () {
  const [sessionCode, setSessionCode] = useState('')
  const createSessionMutation = useCreateSessionMutation()
  const deleteSessionMutation = useDeleteSessionMutation()
  const me = useMeQuery()
  return !me.isLoading && me.data && (
    <>
      {!me.data?.sessions?.length && (
        <>
          <button onClick={createSessionMutation.mutate}>
            create session
          </button>
          <Link
            to="/sessions/$sessionid"
            params={{
              sessionid: sessionCode,
            }}
          >
            Go To Session
          </Link>
          <input onChange={(e) => {setSessionCode(e.target.value)}} value={sessionCode}></input>
        </>
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
  loader: () => useMeQuery.preload(),
  component: IndexPage
})
