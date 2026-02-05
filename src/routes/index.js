import React, { useState, useEffect } from 'react'
import { createFileRoute, Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useCognitoAuth } from "../contexts/cognito-auth-context.js";
import InfoCard from '../components/info-card/info-card.js'
import ButtonWithInput from '../components/button-with-input/button-with-input.js'
import { PencilRuler, Users } from 'lucide-react'

export default function Home () {
  const auth = useCognitoAuth()
  const navigate = useNavigate()
  const queryParams = useSearch({ from: '/' })
  const initialError = queryParams.failedroom
    ? `Cannot find room ${queryParams.failedroom}`
    : null
  const [error, setError] = useState(initialError)

  useEffect(() => {
    if (queryParams.failedroom) {
      setError(`Cannot find room ${queryParams.failedroom}`)
    }
  }, [queryParams.failedroom])

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
              Repeat
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
          <div className="join-room-button__container">
            {error && (
              <div className="join-room-button__error">
                {error}
              </div>
            )}
            <ButtonWithInput
              className="join-room-button"
              label="Join Room:"
              onChange={() => {
                setError(null)
                // clear failedroom query between attempts
                const newQueryParams = {...queryParams}
                delete newQueryParams.failedroom
                navigate({
                  to: '/',
                  search: newQueryParams,
                  replace: true
                })

              }}
              handleClick={(roomCode) => {
                if (roomCode?.length === 4) {
                  navigate({
                    to: '/rooms/$roomcode',
                    params: {
                      roomcode: roomCode,
                    }
                  })
                } else {
                  setError('Room Code should be 4 letters long')
                }
              }}
            />
          </div>
        )}
      </div>
      <div className="home-explanation">
        <InfoCard
          iconComponent={PencilRuler}
          iconSize="7em"
          iconStrokeWidth="1.1"
          description="Define a game using BAGEL (Board-based Automated Game Engine Language)"
        />
        <InfoCard
          iconComponent={Users}
          iconSize="7em"
          iconStrokeWidth="1.1"
          description="Create a lobby in seconds and play with friends using a room code!"
        />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Home
})
