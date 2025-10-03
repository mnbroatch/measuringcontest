import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import makeAuthenticatedRequest from "../utils/make-authenticated-request.js";

const apiUrl = 'https://api.measuringcontest.com'

export const useCreateGameMutation = (roomCode) => {
  const queryClient = useQueryClient()
  const auth = useCognitoAuth()

  return useMutation({
    mutationFn: (gameRules, gameName, players) => makeAuthenticatedRequest(
      `${apiUrl}/rooms/${roomCode}/games`,
      auth.idToken,
      { 
        method: 'POST',
        body: { gameRules, gameName, players },
      }
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room', roomCode] })
    },
  })
}
