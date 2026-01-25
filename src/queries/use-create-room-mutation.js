import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import makeAuthenticatedRequest from "../utils/make-authenticated-request.js";
import { API_URL } from "../constants/api.js";

const apiUrl = `${API_URL}/rooms`

export const useCreateRoomMutation = () => {
  const queryClient = useQueryClient()
  const auth = useCognitoAuth()

  return useMutation({
    mutationFn: ({ gameRules, gameName } = {}) => makeAuthenticatedRequest(
      apiUrl,
      auth.idToken,
      {
        method: 'POST',
        body: { gameRules, gameName },
      }
    ),
    onSuccess: (roomCode) => {
      // Optimistic update
      queryClient.setQueryData(
        ['my-rooms', auth.idToken],
        (old) => [...old, roomCode]
      )
      queryClient.invalidateQueries({ queryKey: ['my-rooms', auth.idToken] })
    },
  })
}
