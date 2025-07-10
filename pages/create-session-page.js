import React from 'react'
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import makeAuthenticatedRequest from "../utils/make-authenticated-request.js";
import { useMutation, useQueryClient } from '@tanstack/react-query'

const apiUrl = 'https://api.measuringcontest.com/sessions'

export default function CreateSessionPage () {
  const queryClient = useQueryClient()
  const auth = useCognitoAuth()

  // Mutations
  const createSessionMutation = useMutation({
    mutationFn: async () => makeAuthenticatedRequest(
      apiUrl,
      await auth.getIdToken(),
      { method: 'POST' }
    ),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['userSessions', await auth.getUserId()] })
    },
  })

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
