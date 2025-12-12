import React from 'react'

export default function HomePageCard ({
  description,
  iconComponent: IconComponent,
  iconSize,
  iconStrokeWidth,
}) {
  return (
    <div className="home-page-card">
      <IconComponent
        size={iconSize}
        strokeWidth={iconStrokeWidth}
        className="home-page-card__icon"
      />
      <div className="home-page-card__description">
        {description}
      </div>
    </div>
  )
}
