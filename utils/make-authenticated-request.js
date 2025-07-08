import makeRequest from './make-request'

export default function makeAuthenticatedRequest (url, token, options = {}) {
  if (!token) {
    throw new Error (`authenticated request attempted with no token: ${url}`)
  }
  console.log('url', url)
  const headers = new Headers(options.headers);
  headers.set('Authorization',  `Bearer ${token}`);
  return makeRequest(url, { ...options, headers })
}
