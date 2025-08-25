import { useSuspenseQuery } from '@tanstack/react-query'
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import makeAuthenticatedRequest from "../utils/make-authenticated-request.js";
import makePreloadAuthenticatedQuery from "../utils/make-preload-authenticated-query.js";

const apiUrl = 'https://api.measuringcontest.com/rooms'

export const useRoomQuery = (roomId) => {
  const auth = useCognitoAuth()
  return useSuspenseQuery(getOptions(auth.idToken, roomId))
}

function getOptions (idToken, roomId) {
  return {
    queryKey: ['room', roomId],
    queryFn: () => makeAuthenticatedRequest(
      `${apiUrl}/${roomId}`,
      idToken,
      { method: 'GET' }
    ),
    staleTime: 1000 * 60 * 50,
    enabled: !!idToken,
  }
}

useRoomQuery.preload = makePreloadAuthenticatedQuery(getOptions)
