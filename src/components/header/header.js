import React from 'react'
import { Link } from '@tanstack/react-router'
import { Construction } from 'lucide-react'
import HomeButton from "./home-button.js"

export default function Header ({ auth }) {
  return (
    <div className="header">
      <HomeButton />
      <div className="header__construction-banner">
        <div className="header__construction-banner__label">
          <Construction size="1.1em" /> pre-alpha
        </div>
      </div>
      <div>
        <Link style={{ paddingRight: '5px' }} to="/editor">
          editor
        </Link>
        {!auth.loading && !auth.idToken && (
          <button
            className="header__login-button"
            onClick={auth.login}
          >
            Login with Google
          </button>
        )}
        {!auth.loading && !!auth.idToken && (
          <button
            className="header__logout-button"
            onClick={auth.logout}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  )
}
