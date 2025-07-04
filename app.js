import React from 'react'
import { Amplify } from '@aws-amplify/core';
import {
  cognitoConfig,
} from "./constants/auth.js";
import useCognitoAuth from "./hooks/useCognitoAuth.js";

Amplify.configure(cognitoConfig);

export default function App () {
  const auth = useCognitoAuth()

  console.log('auth', auth)

  return (
    <div className="content">
      <button onClick={auth.login}>
        Login with Google
      </button>
      <button onClick={auth.logout}>
        Logout
      </button>
      <div>
        {auth.isAuthenticated}
      </div>
    </div>
  )
}
