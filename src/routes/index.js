import React, { useState } from 'react'
import { createFileRoute, Link } from "@tanstack/react-router"
import { useCreateSessionMutation } from "../queries/use-create-session-mutation.js";
import { useDeleteSessionMutation } from "../queries/use-delete-session-mutation.js";
import { useMySessionsQuery } from "../queries/use-my-sessions-query.js";

export default function IndexPage () {
  const [sessionCode, setSessionCode] = useState('')
  const createSessionMutation = useCreateSessionMutation()
  const deleteSessionMutation = useDeleteSessionMutation()
  const mySessions = useMySessionsQuery()
  return !mySessions.isLoading && mySessions.data && (
    <>
      {!mySessions.data?.length && (
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
      {mySessions.data?.length > 0 && mySessions.data.map((sessionId, i) => (
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
  loader: () => useMySessionsQuery.preload(),
  component: IndexPage
})
