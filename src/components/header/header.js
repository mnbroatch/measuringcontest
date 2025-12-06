import React from 'react'
import { Link } from '@tanstack/react-router'
import { Construction } from 'lucide-react'
import HomeButton from "./home-button.js"

export default function Header ({ auth }) {
  return (
    <div className="header">
      <HomeButton />
      <div>
        <span className="header__construction-banner">
          <span className="header__construction-banner__label">
            <Construction size="1.1em" /> pre-alpha
          </span>
        </span>
      </div>
      <div>
        <Link style={{ paddingRight: '5px' }} to="/editor">
          editor
        </Link>
        {!auth.loading && !auth.idToken && (
          <button onClick={auth.login}>
            Login with Google
          </button>
        )}
        {!auth.loading && !!auth.idToken && (
          <button onClick={auth.logout}>
            Logout
          </button>
        )}
      </div>
    </div>
  )
}
