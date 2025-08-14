export default async function makeRequest (url, options = {}) {
  const {
    method = 'GET',
    headers = {},
    body,
    ...restOptions
  } = options;

  const fetchHeaders = new Headers(headers);

  // Set Content-Type for JSON body if not set and body is present
  if (body && !fetchHeaders.has('Content-Type')) {
    fetchHeaders.set('Content-Type', 'application/json');
  }

  // Prepare fetch options
  const fetchOptions = {
    method,
    headers: fetchHeaders,
    ...restOptions,
  };

  // If body is an object (not FormData), stringify it
  if (body && !(body instanceof FormData)) {
    fetchOptions.body = JSON.stringify(body);
  } else if (body) {
    // If FormData or other body types, send as-is
    fetchOptions.body = body;
  }

  console.log('fetchOptions', fetchOptions)

  // Make the fetch call
  const response = await fetch(url, fetchOptions);

  // Parse JSON if possible
  let data;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  // Throw error if response is not ok (status 2xx)
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status} ${response.statusText}`);
    error.status = response.status;
    error.statusText = response.statusText;
    error.data = data;
    throw error;
  }

  return data;
}
