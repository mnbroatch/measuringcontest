import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import makeAuthenticatedRequest from "../utils/make-authenticated-request.js";

const apiUrl = 'https://api.measuringcontest.com/rooms'

export const useDeleteRoomMutation = () => {
  const queryClient = useQueryClient()
  const auth = useCognitoAuth()

  return useMutation({
    mutationFn: (roomCode) => makeAuthenticatedRequest(
      `${apiUrl}/${roomCode}`,
      auth.idToken,
      { method: 'DELETE' }
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-rooms', auth.idToken] })
    },
  })
}
