import React from 'react'
import HomeButton from "./home-button.js"

export default function Header ({ auth }) {
  return (
    <div className="header">
      <HomeButton />
      {!auth.loading && !auth.idToken && (
        <button
          className="button button--small button--style-b"
          onClick={auth.login}
        >
          Login
        </button>
      )}
      {!auth.loading && !!auth.idToken && (
        <button
          className="button button--small button--style-b"
          onClick={auth.logout}
        >
          Logout
        </button>
      )}
    </div>
  )
}
