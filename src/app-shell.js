import React from 'react'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
const router = createRouter({ routeTree })

// this extra layer is here under the query and auth providers so we can use authenticated routes if we want to later
export default function AppShell () {
  return <RouterProvider router={router} />
}
