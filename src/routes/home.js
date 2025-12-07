import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export default function Home () {
  return (
    <div className="home">
      <div className="home__splash">
        <h1 className="home__tagline">
          <div>
            Play,
          </div>
          <div>
            Tweak,
          </div>
          <div>
            Repeat.
          </div>
        </h1>
        <h5 className="home__description">
          A platform for prototyping board game rules design
        </h5>
      </div>
      <div className="home__explanation">
        Define a game in BAGEL (Board game Automation Game Engine Language) that describes rules, pieces, and interactions. Create a lobby in seconds and play with friends using a room code!
      </div>
    </div>
  )
}

export const Route = createFileRoute('/home')({
  component: Home
})
