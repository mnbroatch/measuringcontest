import { useSuspenseQuery } from '@tanstack/react-query'
import { getAuth } from "../../auth.js";

const AUTH_QUERY_KEY = 'auth';

export const useCognitoQuery = () => {
  return useSuspenseQuery({
    queryKey: [AUTH_QUERY_KEY],
    queryFn: getAuth,
    staleTime: 1000 * 60 * 50,
  })
}
