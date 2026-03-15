import React from 'react'
import HomeButton from "./home-button.js"

export default function Header ({ auth }) {
  return (
    <div className="header">
      <HomeButton />
      <a
        href="https://boardgameengine.com/docs/index.html"
        target="_blank"
        rel="noopener noreferrer"
        className="header-docs-link"
      >
        Docs
      </a>
      {!auth.loading && !auth.idToken && (
        <button
          className="button button--x-small button--style-b"
          onClick={auth.login}
        >
          Login
        </button>
      )}
      {!auth.loading && !!auth.idToken && (
        <button
          className="button button--x-small button--style-b"
          onClick={auth.logout}
        >
          Logout
        </button>
      )}
    </div>
  )
}
