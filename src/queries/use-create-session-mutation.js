import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import makeAuthenticatedRequest from "../utils/make-authenticated-request.js";

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
      queryClient.invalidateQueries({ queryKey: ['me', auth.idToken] })
    },
  })
}
