import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import makeAuthenticatedRequest from "../utils/make-authenticated-request.js";

const apiUrl = 'https://api.measuringcontest.com'

export const useJoinGameMutation = (roomCode, gameId) => {
  const queryClient = useQueryClient()
  const auth = useCognitoAuth()

  return useMutation({
    mutationFn: () => makeAuthenticatedRequest(
      `${apiUrl}/rooms/${roomCode}/games/${gameId}/join`,
      auth.idToken,
      { method: 'POST' }
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room', roomCode] })
    },
  })
}
