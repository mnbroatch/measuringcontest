import queryClient from '../../query-client.js'
export default function preloadQuery (queryOptions) {
  return queryClient.ensureQueryData(queryOptions);
}
