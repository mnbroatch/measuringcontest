import React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import HomePageCard from '../components/home-page-card/home-page-card.js'
import ButtonWithInput from '../components/button-with-input/button-with-input.js'
import { PencilRuler, Users } from 'lucide-react'

export default function Home () {
  const auth = useCognitoAuth()
  const navigate = useNavigate()

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
          A platform and declarative language for prototyping board game rules design
        </h5>
      </div>
      <div className="home-buttons">
        <Link
          className="button button--style-a"
          to="/editor"
        >
          Get Started!
        </Link>
        {!auth.loading && !auth.idToken && (
          <button
          className="button button--style-b"
            onClick={auth.login}
          >
            Log in to Join a Room
          </button>
        )}
        {!auth.loading && auth.idToken && (
          <ButtonWithInput
            className="join-room-button"
            label="Join Room:"
            handleClick={(roomCode) => {
              navigate({
                to: '/rooms/$roomcode',
                params: {
                  roomcode: roomCode,
                }
              })
            }}
          />
        )}
      </div>
      <div className="home-explanation">
        <HomePageCard
          iconComponent={PencilRuler}
          iconSize="5em"
          iconStrokeWidth="1.3"
          description="Define a game using BAGEL (Board-based Automated Game Engine Language)"
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

export const Route = createFileRoute('/')({
  component: Home
})
