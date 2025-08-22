import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import makeAuthenticatedRequest from "../utils/make-authenticated-request.js";

const apiUrl = 'https://api.measuringcontest.com/sessions'

// how would we do invalidation if we passed sessionId in at call time?
export const useJoinSessionMutation = (sessionId) => {
  const queryClient = useQueryClient()
  const auth = useCognitoAuth()

  return useMutation({
    mutationFn: () => makeAuthenticatedRequest(
      `${apiUrl}/${sessionId}/members`,
      auth.idToken,
      { method: 'POST' }
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] })
    },
  })
}
