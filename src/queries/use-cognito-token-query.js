import { useSuspenseQuery } from '@tanstack/react-query'
import { getIdToken } from "../../auth.js";

const AUTH_QUERY_KEY = 'auth';

export const useCognitoTokenQuery = () => {
  return useSuspenseQuery({
    queryKey: [AUTH_QUERY_KEY],
    queryFn: getIdToken,
    staleTime: 1000 * 60 * 50,
  })
}
