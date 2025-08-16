import React from 'react'
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import { createRootRoute, Outlet } from '@tanstack/react-router'

export default function AppShell () {
  const auth = useCognitoAuth()

  return (
    <>
      <div className="login-bar">
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
      <div className="content">
          <Outlet />
      </div>
    </>
  )
}

export const Route = createRootRoute({
  component: AppShell
})
