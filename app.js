import React from 'react'
import authConstants from "./constants/auth.js";
import useCognitoAuth from "./hooks/useCognitoAuth.js";

export default function App () {
  const auth = useCognitoAuth({
    ...authConstants,
    Storage: localStorage
  })

  console.log('auth', auth)

  return (
    <div className="content">
      <a href="https://auth.measuringcontest.com/login?client_id=lmckmqd7bndat4ot0ajl7u2uk&response_type=code&scope=email+openid+profile&redirect_uri=https://measuringcontest.com">
        Login with Google
      </a>
    </div>
  )
}
