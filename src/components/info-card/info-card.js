import React from 'react'

export default function InfoCard ({
  description,
  iconComponent: IconComponent,
  iconSize,
  iconStrokeWidth,
}) {
  return (
    <div className="info-card">
      <IconComponent
        size={iconSize}
        strokeWidth={iconStrokeWidth}
        className="info-card__icon"
      />
      <div className="info-card__description">
        {description}
      </div>
    </div>
  )
}
