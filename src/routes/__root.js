import React from 'react'
import { createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import { useIsMutating } from '@tanstack/react-query'
import { useMyRoomsQuery } from "../queries/use-my-rooms-query.js";
import { useCognitoQuery } from '../queries/use-cognito-query.js';
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import { LoadingProvider, useLoading } from "../contexts/loading-context.js";
import Header from "../components/header/header.js";

function RootContent() {
  const auth = useCognitoAuth()
  const { isLoading } = useLoading()
  const mutationCount = useIsMutating()
  const loading = isLoading || !!mutationCount
  
  return (
    <>
      <Header auth={auth} />
      <div
        style={{ flex: 1 }}
        className="content"
      >
        {loading && (
          <div className="spinner"></div>
        )}
        <div
          className="content__inner"
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            ...(loading && { display: 'none' })
          }}
        >
          <Outlet />
        </div>
      </div>
    </>
  )
}

function Root() {
  return (
    <LoadingProvider>
      <RootContent />
    </LoadingProvider>
  )
}

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    const publicPaths = ['/', '/editor']
    const isPublicRoute = publicPaths.some(path => location.pathname === path)
    const myRooms = await useMyRoomsQuery.preload()
    if (myRooms?.length && !location.pathname.startsWith(`/rooms/${myRooms[0]}`)) {
      throw redirect({
        to: '/rooms/$roomcode',
        params: { roomcode: myRooms[0] }
      })
    } else if (!isPublicRoute) {
      const auth = await useCognitoQuery.preload()
      if (!auth?.idToken) {
        throw redirect({
          to: '/',
          search: { redirect: location.href }
        })
      }
    }
  },
  component: Root
})
