import React, { useState } from 'react'

export default function ButtonWithInput ({
  handleClick,
  label,
  defaultValue,
  className,
}) {
  const [value, setValue] = useState(defaultValue || '')

  return (
    <button
      className={[
        'button',
        'button--style-b',
        className,
      ].filter(Boolean).join(' ')}
      onClick={() => { handleClick(value) }}
    >
      {label}
      <input
        className="button-with-input__input"
        onClick={(e) => { e.stopPropagation() }}
        onChange={(e) => {
          setValue(e.target.value)}
        }
        value={value}
      >
      </input>
    </button>
  )
}
