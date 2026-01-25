import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import makeAuthenticatedRequest from "../utils/make-authenticated-request.js";
import { API_URL } from "../constants/api.js";

const apiUrl = `${API_URL}/rooms`

export const useDeleteRoomMutation = () => {
  const queryClient = useQueryClient()
  const auth = useCognitoAuth()

  return useMutation({
    mutationFn: (roomCode) => makeAuthenticatedRequest(
      `${apiUrl}/${roomCode}`,
      auth.idToken,
      { method: 'DELETE' }
    ),
    onSuccess: async (_, roomCode) => {
      // Optimistic update
      queryClient.setQueryData(['my-rooms', auth.idToken], (old) => {
        return old?.filter(code => code !== roomCode) ?? []
      })
      
      queryClient.invalidateQueries({ queryKey: ['my-rooms', auth.idToken] })
      queryClient.invalidateQueries({ queryKey: ['room', roomCode] })
    },
  })
}
