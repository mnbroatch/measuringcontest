import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import makeAuthenticatedRequest from "../utils/make-authenticated-request.js";
import { useQuery } from '@tanstack/react-query'

const apiUrl = 'https://api.measuringcontest.com/sessions'

export const useSessionQuery = (sessionId) => {
  const auth = useCognitoAuth()
  return useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => makeAuthenticatedRequest(
      `${apiUrl}/${sessionId}`,
      auth.idToken,
      { method: 'GET' }
    ),
    staleTime: 1000 * 60 * 50,
    enabled: !!auth.idToken,
  })
}
