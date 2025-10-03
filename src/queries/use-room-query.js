import { useSuspenseQuery } from '@tanstack/react-query'
import makeRequest from '../utils/make-request'
import preloadQuery from "../utils/preload-query.js";

const apiUrl = 'https://api.measuringcontest.com/rooms'

export const useRoomQuery = (roomCode) => {
  return useSuspenseQuery(getOptions(roomCode))
}

function getOptions (roomCode) {
  return {
    queryKey: ['room', roomCode],
    queryFn: () => makeRequest(
      `${apiUrl}/${roomCode}`,
      { method: 'GET' }
    ),
    staleTime: 1000 * 60 * 50,
  }
}

useRoomQuery.preload = (roomCode) => { preloadQuery(getOptions(roomCode)) }
