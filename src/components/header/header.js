import React from 'react'
import { Link } from '@tanstack/react-router'
import HomeButton from "./home-button.js";

export default function Header ({ auth }) {
  return (
    <div className="header">
      <HomeButton />
      <Link style={{ paddingRight: '5px' }} to="/editor">
        editor
      </Link>
      {auth?.userId}
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
  )
}
