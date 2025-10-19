import React from 'react'
import { createRootRoute, Outlet, Link, redirect } from '@tanstack/react-router'
import { useCognitoQuery } from '../queries/use-cognito-query.js';
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";

export default function Root () {
  const auth = useCognitoAuth()

  return (
    <>
      <Link style={{ paddingRight: '5px' }} to="/">
        home
      </Link>
      <Link style={{ paddingRight: '5px' }} to="/editor">
        editor
      </Link>
      {auth?.userId}
      <div className="login-bar">
        {!auth.loading && !auth.idToken && (
          <button onClick={auth.login}>
            Login with Google
          </button>
        )}
        {!auth.loading && !!auth.idToken && (
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
  beforeLoad: async ({ location }) => {
    const publicPaths = ['/login', '/editor']
    const isPublicRoute = publicPaths.some(path => location.pathname === path)
    
    if (!isPublicRoute) {
      const auth = await useCognitoQuery.preload()
      if (!auth?.idToken) {
        throw redirect({
          to: '/login',
          search: { redirect: location.href }
        })
      }
    }
  },
  component: Root
})
