import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export default function Home () {
  return (
    <div className="home">

    </div>
  )
}

export const Route = createFileRoute('/home')({
  component: Home
})
