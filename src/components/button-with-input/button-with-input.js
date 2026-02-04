import React, { useState } from 'react'

export default function ButtonWithInput ({
  handleClick,
  label,
  defaultValue = '',
  onChange,
  className,
}) {
  const [value, setValue] = useState(defaultValue || '')
  
  const handleSubmit = () => {
    handleClick(value)
  }
  
  return (
    <button
      className={[
        'button',
        'button--style-b',
        className,
      ].filter(Boolean).join(' ')}
      onClick={handleSubmit}
    >
      {label}
      <input
        className="button-with-input__input"
        onClick={(e) => { e.stopPropagation() }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            e.stopPropagation()
            handleSubmit()
          }
        }}
        onChange={(e) => {
          const value = e.target.value.trim().toLowerCase()
          onChange?.(value)
          setValue(value)
        }}
        value={value}
      />
    </button>
  )
}
