import React from 'react'
import { createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import { useIsMutating } from '@tanstack/react-query'
import { useMyRoomsQuery } from "../queries/use-my-rooms-query.js";
import { useCognitoQuery } from '../queries/use-cognito-query.js';
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import Header from "../components/header/header.js";

export default function Root () {
  const auth = useCognitoAuth()
  const mutationCount = useIsMutating()

  return (
    <>
      <Header auth={auth} />
      <div
        style={{ flex: 1 }}
        className="content"
      >
        <div
          className="content__inner"
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            visibility: mutationCount ? 'hidden' : 'visible'
          }}
        >
          <Outlet />
        </div>
        {!!mutationCount && (
          <div className="spinner"></div>
        )}
      </div>
    </>
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
    } else if (!myRooms?.length && location.pathname.startsWith('/rooms/')) {
      throw redirect({ to: '/' })
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
