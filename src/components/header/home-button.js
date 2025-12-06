import React from 'react'
import { Link } from '@tanstack/react-router'
import { Cog } from 'lucide-react';

export default function HomeButton () {
  return (
    <Link className="header__home-button" to="/">
      B<Cog size="1em" strokeWidth="3.5" />ard Game Engine
    </Link>
  )
}
