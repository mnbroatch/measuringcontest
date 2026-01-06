import { useSuspenseQuery } from '@tanstack/react-query'
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import makeAuthenticatedRequest from "../utils/make-authenticated-request.js";
import makePreloadAuthenticatedQuery from "../utils/make-preload-authenticated-query.js";
import { API_URL } from "../constants/api.js";

const apiUrl = `${API_URL}/api.measuringcontest.com/me`

export const useMeQuery = () => {
  const auth = useCognitoAuth()
  return useSuspenseQuery(getOptions(auth.idToken))
}

function getOptions (idToken) {
  return {
    queryKey: ['me', idToken],
    queryFn: () => makeAuthenticatedRequest(
      apiUrl,
      idToken,
      { method: 'GET' }
    ),
    staleTime: 1000 * 60 * 50,
  }
}

useMeQuery.preload = makePreloadAuthenticatedQuery(getOptions)
