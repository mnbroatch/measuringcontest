import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import makeAuthenticatedRequest from "../utils/make-authenticated-request.js";
import { API_URL } from "../constants/api.js";

export const useCreateGameMutation = (roomCode) => {
  const queryClient = useQueryClient()
  const auth = useCognitoAuth()

  return useMutation({
    mutationFn: ({ gameRules, gameName, players }) => makeAuthenticatedRequest(
      `${API_URL}/rooms/${roomCode}/games`,
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
