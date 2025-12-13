import React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import HomePageCard from '../components/home-page-card/home-page-card.js'
import { PencilRuler, Users } from 'lucide-react'

export default function Home () {
  return (
    <div className="home">
      <div className="home-splash">
        <div className="home-tagline">
          <h1 className="home-tagline__inner">
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
        </div>
        <h5 className="home-description">
          A platform for prototyping board game rules design
        </h5>
      </div>
      <Link
        className="get-started-button"
        to="/editor"
      >
        Get Started!
      </Link>
      <div className="home-explanation">
        <HomePageCard
          iconComponent={PencilRuler}
          iconSize="5em"
          iconStrokeWidth="1.3"
          description="Define a game using BAGEL (Board game Automation Game Engine Language)"
        />
        <HomePageCard
          iconComponent={Users}
          iconSize="5em"
          iconStrokeWidth="1.3"
          description="Create a lobby in seconds and play with friends using a room code!"
        />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/home')({
  component: Home
})
