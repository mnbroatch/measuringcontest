import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import makeAuthenticatedRequest from "../utils/make-authenticated-request.js";
import { useMutation, useQueryClient } from '@tanstack/react-query'

const apiUrl = 'https://api.measuringcontest.com/sessions'

export const useCreateSessionMutation = () => {
  const queryClient = useQueryClient()
  const auth = useCognitoAuth()

  return useMutation({
    mutationFn: () => makeAuthenticatedRequest(
      apiUrl,
      auth.idToken,
      { method: 'POST' }
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSessions', auth.userId] })
    },
  })
}
