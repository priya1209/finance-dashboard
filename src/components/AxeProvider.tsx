'use client'

import { useEffect } from 'react'
import React from 'react'
import ReactDOM from 'react-dom'

interface AxeProviderProps {
  children: React.ReactNode
}

export function AxeProvider({ children }: AxeProviderProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@axe-core/react').then(AxeCore => {
        AxeCore.default(React, ReactDOM, 1000)
      })
    }
  }, [])

  return <>{children}</>
}
