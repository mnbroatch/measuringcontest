import { useSuspenseQuery } from '@tanstack/react-query'
import { getAuth } from "../../auth.js";
import preloadQuery from "../utils/preload-query.js";

export const AUTH_QUERY_KEY = 'auth';

const options = {
  queryKey: [AUTH_QUERY_KEY],
  queryFn: getAuth,
  refetchOnWindowFocus: true,
  staleTime: 1000 * 60 * 50,
}

export const useCognitoQuery = () => {
  return useSuspenseQuery(options)
}

useCognitoQuery.preload = () => preloadQuery(options)
