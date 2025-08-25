import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import makeAuthenticatedRequest from "../utils/make-authenticated-request.js";

const apiUrl = 'https://api.measuringcontest.com/rooms'

// how would we do invalidation if we passed roomCode in at call time?
export const useJoinRoomMutation = (roomCode) => {
  const queryClient = useQueryClient()
  const auth = useCognitoAuth()

  return useMutation({
    mutationFn: () => makeAuthenticatedRequest(
      `${apiUrl}/${roomCode}/members`,
      auth.idToken,
      { method: 'POST' }
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room', roomCode] })
    },
  })
}
