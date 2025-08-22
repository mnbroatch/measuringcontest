import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import makeAuthenticatedRequest from "../utils/make-authenticated-request.js";

const apiUrl = 'https://api.measuringcontest.com/sessions'

// will need to pass userId at runtime in order for creator to kick players
export const useLeaveSessionMutation = (sessionId) => {
  const queryClient = useQueryClient()
  const auth = useCognitoAuth()

  return useMutation({
    mutationFn: () => makeAuthenticatedRequest(
      `${apiUrl}/${sessionId}/members`,
      auth.idToken,
      { method: 'DELETE' }
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] })
    },
  })
}
