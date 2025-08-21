import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import makeAuthenticatedRequest from "../utils/make-authenticated-request.js";

const apiUrl = 'https://api.measuringcontest.com/sessions'

export const useDeleteSessionMutation = () => {
  const queryClient = useQueryClient()
  const auth = useCognitoAuth()

  return useMutation({
    mutationFn: (sessionId) => makeAuthenticatedRequest(
      `${apiUrl}/${sessionId}`,
      auth.idToken,
      { method: 'DELETE' }
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me', auth.idToken] })
    },
  })
}
