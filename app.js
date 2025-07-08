import React from 'react'
import { Amplify } from 'aws-amplify';
import {
  cognitoConfig,
} from "./constants/auth.js";
import useCognitoAuth from "./hooks/useCognitoAuth.js";
import makeAuthenticatedRequest from "./utils/make-authenticated-request.js";

Amplify.configure(cognitoConfig);

const apiUrl = 'https://api.measuringcontest.com/sessions'

export default function App () {
  const auth = useCognitoAuth()

  const createSession = async () => {
    const idToken = await auth.getIdToken()
    const userId = await auth.getUserId()
    const session = await makeAuthenticatedRequest(
      apiUrl,
      idToken,
      { method: 'POST' }
    )
    console.log('session', session)
  }

  return (
    <div className="content">
      {!auth.loading && !auth.isAuthenticated && (
        <button onClick={auth.login}>
          Login with Google
        </button>
      )}
      {!auth.loading && auth.isAuthenticated && (
        <>
          <button onClick={auth.logout}>
            Logout
          </button>
          <button onClick={createSession}>
            create session
          </button>
        </>
      )}
    </div>
  )
}
