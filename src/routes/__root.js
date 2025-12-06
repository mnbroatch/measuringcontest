import React from 'react'
import { createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import { useCognitoQuery } from '../queries/use-cognito-query.js';
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import Header from "../components/header/header.js";

export default function Root () {
  const auth = useCognitoAuth()

  return (
    <>
      <Header auth={auth} />
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
