import React from 'react'
import { Link } from '@tanstack/react-router'
import { Construction } from 'lucide-react'
import HomeButton from "./home-button.js"

export default function Header ({ auth }) {
  return (
    <div className="header">
      <HomeButton />
      {!auth.loading && !auth.idToken && (
        <button
          className="header__login-button"
          onClick={auth.login}
        >
          Login
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
  )
}
