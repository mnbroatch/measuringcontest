import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import makeAuthenticatedRequest from "../utils/make-authenticated-request.js";
import { useQuery } from '@tanstack/react-query'

const apiUrl = 'https://api.measuringcontest.com/me'

export const useMeQuery = () => {
  const auth = useCognitoAuth()

  return useQuery({
    queryKey: [auth.idToken],
    queryFn: () => makeAuthenticatedRequest(
      apiUrl,
      auth.idToken,
      { method: 'GET' }
    ),
    staleTime: 1000 * 60 * 55,
    enabled: !!auth.idToken
  })
}
