import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export default function Login () {
  return 'Log In To Play!'
}

export const Route = createFileRoute('/login')({
  component: Login
})
