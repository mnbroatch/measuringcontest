import React from 'react'
import { Amplify } from 'aws-amplify';
import {
  cognitoConfig,
} from "./constants/auth.js";
import useCognitoAuth from "./hooks/useCognitoAuth.js";

Amplify.configure(cognitoConfig);

export default function App () {
  const auth = useCognitoAuth()

  console.log('auth.isAuthenticated', auth.isAuthenticated)

  return (
    <div className="content">
      {!auth.loading && !auth.isAuthenticated && (
        <button onClick={auth.login}>
          Login with Google
        </button>
      )}
      {!auth.loading && auth.isAuthenticated && (
        <button onClick={auth.logout}>
          Logout
        </button>
      )}
    </div>
  )
}
