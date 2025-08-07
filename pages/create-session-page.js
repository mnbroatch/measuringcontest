import React from 'react'
import { useCreateSessionMutation } from "../queries/use-create-session-mutation.js";
import { useMeQuery } from "../queries/use-me-query.js";
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";

export default function CreateSessionPage () {
  const createSessionMutation = useCreateSessionMutation()
  const auth = useCognitoAuth()
  const me = useMeQuery()
  console.log('me', me)

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
