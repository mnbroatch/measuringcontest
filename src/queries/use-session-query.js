import { useSuspenseQuery } from '@tanstack/react-query'
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import makeAuthenticatedRequest from "../utils/make-authenticated-request.js";
import makePreloadAuthenticatedQuery from "../utils/make-preload-authenticated-query.js";

const apiUrl = 'https://api.measuringcontest.com/sessions'

export const useSessionQuery = (sessionId) => {
  const auth = useCognitoAuth()
  return useSuspenseQuery(getOptions(auth.idToken, sessionId))
}

function getOptions (idToken, sessionId) {
  return {
    queryKey: ['session', sessionId],
    queryFn: () => makeAuthenticatedRequest(
      `${apiUrl}/${sessionId}`,
      idToken,
      { method: 'GET' }
    ),
    staleTime: 1000 * 60 * 50,
    enabled: !!idToken,
  }
}

useSessionQuery.preload = makePreloadAuthenticatedQuery(getOptions)
