import React from 'react'
import { useCreateSessionMutation } from "./queries/use-create-session-mutation.js";
import { useMeQuery } from "./queries/use-me-query.js";
import { useCognitoAuth } from "./contexts/cognito-auth-context.js";
import CreateSessionPage from "./src/pages/create-session-page.js";

export default function AppShell () {
  const createSessionMutation = useCreateSessionMutation()
  const auth = useCognitoAuth()
  const me = useMeQuery()
  console.log('me.data', me.data)

  return (
    <div className="content">
      <div className="login-bar">
        {!auth.loading && !auth.isAuthenticated && (
          <button onClick={auth.login}>
            Login with Google
          </button>
        )}
        {!auth.loading && auth.isAuthenticated && (
          <button onClick={auth.logout}>
            Logout
          </button>
        )}
      </div>
      {!auth.loading && auth.isAuthenticated && !createSessionMutation.loading && !me.isLoading && (
        <>
          {me.data?.sessions?.length === 0 && (
            <button onClick={createSessionMutation.mutate}>
              create session
            </button>
          )}
          {me.data?.sessions?.length > 0 && (
            <a onClick={() => { console.log(sessionId) }}>
              {sessionId}
            </a>
          )}
        </>
      )}
      {createSessionMutation.loading && "loading"}
    </div>
  )
}
