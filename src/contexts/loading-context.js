import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'

const LoadingContext = createContext(null)

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const startLoading = useCallback(() => setIsLoading(true), [])
  const stopLoading = useCallback(() => setIsLoading(false), [])
  
  useEffect(() => {
    return router.subscribe('onResolved', () => {
      setIsLoading(false)
    })
  }, [router])
  
  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}
