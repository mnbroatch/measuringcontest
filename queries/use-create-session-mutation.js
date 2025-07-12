import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import makeAuthenticatedRequest from "../utils/make-authenticated-request.js";
import { useMutation, useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()
const auth = useCognitoAuth()

const apiUrl = 'https://api.measuringcontest.com/sessions'

export const useCreateSessionMutation = () => {
  return useMutation({
    mutationFn: async () => makeAuthenticatedRequest(
      apiUrl,
      await auth.getIdToken(),
      { method: 'POST' }
    ),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['userSessions', await auth.getUserId()] })
    },
  })
}
