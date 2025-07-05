import React from 'react'
import { Amplify } from 'aws-amplify';
import {
  cognitoConfig,
} from "./constants/auth.js";
import useCognitoAuth from "./hooks/useCognitoAuth.js";
import makeAuthenticatedRequest from "./utils/make-authenticated-request.js";

Amplify.configure(cognitoConfig);

export default function App () {
  const auth = useCognitoAuth()

  const putNumberInCloud = async () => {
    const idToken = await auth.getIdToken()
    const userId = await auth.getUserId()
    makeAuthenticatedRequest(
      'https://api.measuringcontest.com',
      idToken,
      {
        method: 'PUT',
        body: { id: userId, name: Date.now() }
      }
    )
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
          <button onClick={putNumberInCloud}>
            put now in cloud
          </button>
        </>
      )}
    </div>
  )
}
