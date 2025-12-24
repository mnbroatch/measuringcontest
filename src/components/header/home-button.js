import React from 'react'
import { Link } from '@tanstack/react-router'
import { Cog } from 'lucide-react';

export default function HomeButton () {
  return (
    <Link
      className="header-home-button" to="/"
      aria-label="Board Game Engine"
    >
      <span aria-hidden="true">
        B<Cog size="1em" strokeWidth="3.5" />ard Game
      </span>
      <div aria-hidden="true">
        Engine
      </div>
    </Link>
  )
}
