import React from 'react'
import { useCreateSessionMutation } from "../utils/use-create-session-mutation.js";

export default function CreateSessionPage () {
  const createSessionMutation  = useCreateSessionMutation()
  return (
    <div className="content">
      {!auth.loading && !auth.isAuthenticated && (
        <button onClick={auth.login}>
          Login with Google
        </button>
      )}
      {!auth.loading && auth.isAuthenticated && !createSessionMutation.loading && (
        <>
          <button onClick={auth.logout}>
            Logout
          </button>
          <button onClick={createSessionMutation.mutate}>
            create session
          </button>
        </>
      )}
      {createSessionMutation.loading && "loading"}
    </div>
  )
}
